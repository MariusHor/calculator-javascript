import { toggleClasses, getEl } from '@utils';
import { INPUT_VALUES } from '../constants';

export default class ViewMain {
  $ = {
    mainContainer: getEl('.calculator__main'),
  };

  static generateInputButtons = () => {
    const inputs = INPUT_VALUES.map(
      input => `
        <li>
          <button class="${ViewMain.setInputClass(input)}" data-calc='input' data-type=${
        Number.isNaN(parseInt(input, 10)) ? 'symbol' : 'number'
      } data-value=${input}>${ViewMain.setInputText(input)}</button>
        </li>
      `,
    ).join('');

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
        return 'button button--third';
      }
      case 'Enter': {
        return 'button button--secondary';
      }
      default:
        return 'button button--primary';
    }
  }

  toggleContainer = () => {
    this.$.mainContainer.innerHTML = '';
    toggleClasses(this.$.mainContainer, ['main-grid', 'history', 'opacity']);
  };

  toggleContainerOpacity() {
    this.$.mainContainer.classList.toggle('opacity');
  }

  bindUserInput = callback => {
    this.$.mainContainer.addEventListener('click', event => {
      const userInput = event.target.closest("[data-calc='input']");
      if (!userInput) return;

      const { type, value } = userInput.dataset;

      callback(type, value);
    });

    document.addEventListener('keydown', event => {
      if (INPUT_VALUES.includes(event.key)) {
        const type = Number.isInteger(parseInt(event.key, 10)) ? 'number' : 'symbol';
        callback(type, event.key);
      }
    });
  };

  render = () => {
    this.$.mainContainer.insertAdjacentHTML('afterbegin', ViewMain.generateInputButtons());
  };
}
