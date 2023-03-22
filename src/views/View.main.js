import { toggleClasses } from '@utils';
import View from './View';

export default class ViewMain extends View {
  #inputValues = [
    '7',
    '8',
    '9',
    'Backspace',
    '4',
    '5',
    '6',
    '+',
    '1',
    '2',
    '3',
    '-',
    '.',
    '0',
    '/',
    '*',
    'Escape',
    'Enter',
  ];

  generateInputButtons = () => {
    const inputs = this.#inputValues
      .map(
        input => `
        <li>
          <button class="${ViewMain.setInputClass(input)}" data-calc='input' data-type=${
          Number.isNaN(parseInt(input, 10)) ? 'symbol' : 'number'
        } data-value=${input}>${ViewMain.setInputText(input)}</button>
        </li>
      `,
      )
      .join('');

    return `
            <ul class="main-grid">${inputs}</ul>
    `;
  };

  static setInputText(input) {
    switch (input) {
      case 'Backspace': {
        return 'DEL';
      }
      case 'Enter': {
        return '=';
      }
      case 'Escape': {
        return 'RESET';
      }
      default:
        return input;
    }
  }

  static setInputClass(input) {
    switch (input) {
      case 'Backspace':
      case 'Escape': {
        return 'button button--grey';
      }
      case 'Enter': {
        return 'button button--orange';
      }
      default:
        return 'button button--beige';
    }
  }

  toggleContainer = () => {
    const { mainContainer } = this.$;

    mainContainer.innerHTML = '';
    toggleClasses(mainContainer, ['main-grid', 'history', 'opacity']);
  };

  toggleContainerOpacity() {
    this.$.mainContainer.classList.toggle('opacity');
  }

  bindUserInput = callback => {
    this.$.inputsContainer.addEventListener('click', event => {
      const userInput = event.target.closest("[data-calc='input']");
      if (!userInput) return;

      const { type, value } = userInput.dataset;

      callback(type, value);
    });

    document.addEventListener('keydown', event => {
      if (this.#inputValues.includes(event.key)) {
        const type = Number.isInteger(parseInt(event.key, 10)) ? 'number' : 'symbol';
        callback(type, event.key);
      }
    });
  };

  render = () => {
    this.$.mainContainer.insertAdjacentHTML('afterbegin', this.generateInputButtons());
  };
}
