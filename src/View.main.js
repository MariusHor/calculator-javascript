import { getEl, toggleClasses } from './utils';

export default class ViewMain {
  $ = {
    mainContainer: getEl('.calculator__main'),
    calculatorContainer: getEl('.calculator'),
    inputsContainer: getEl('.calculator__main'),
    resultbar: getEl('.calculator__result-bar'),
    resultField: getEl('.calculator__result'),
    tempField: getEl('.calculator__temp-result'),
  };

  #inputValues = [7, 8, 9, 'DEL', 4, 5, 6, '+', 1, 2, 3, '-', '.', 0, '/', 'x', 'RESET', '='];

  transitionViewSwitch = callback => {
    const { mainContainer } = this.$;
    const { toggleContainer } = this;

    setTimeout(() => {
      toggleContainer();
      callback();
    }, 700);

    toggleClasses(mainContainer, ['opacity']);
  };

  toggleContainer = () => {
    const { mainContainer } = this.$;

    mainContainer.innerHTML = '';
    toggleClasses(mainContainer, ['main-grid', 'history', 'opacity']);
  };

  generateInputButtons = () => {
    const inputs = this.#inputValues
      .map(
        input => `
        <li>
          <button class="${ViewMain.setInputClass(input)}" data-type=${ViewMain.setInputDataType(
          input,
        )} data-value=${input}>${input}</button>
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

  static setInputDataType(input) {
    if (typeof input === 'number' || input === '.') return 'number';

    if (input === 'DEL' || input === 'RESET') {
      return 'action';
    }
    return 'operation';
  }

  render = () => {
    const { mainContainer } = this.$;
    const { generateInputButtons } = this;

    mainContainer.insertAdjacentHTML('afterbegin', generateInputButtons());
  };
}
