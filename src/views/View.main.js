import { toggleClasses } from '@utils';
import View from './View';

export default class ViewMain extends View {
  #inputValues = [7, 8, 9, 'DEL', 4, 5, 6, '+', 1, 2, 3, '-', '.', 0, '/', 'x', 'RESET', '='];

  generateInputButtons = () => {
    const inputs = this.#inputValues
      .map(
        input => `
        <li>
          <button class="${ViewMain.setInputClass(input)}" data-calc='input' data-type=${
          typeof input === 'number' ? 'number' : 'symbol'
        } data-value=${input}>${input}</button>
        </li>
      `,
      )
      .join('');

    return `
            <ul class="main-grid">${inputs}</ul>
    `;
  };

  static setInputClass(input) {
    switch (input) {
      case 'DEL':
      case 'RESET': {
        return 'button button--grey';
      }
      case '=': {
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
  };

  render = () => {
    this.$.mainContainer.insertAdjacentHTML('afterbegin', this.generateInputButtons());
  };
}
