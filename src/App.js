import './App.scss';

export default class App {
  constructor({ root, calculator }) {
    this.root = root;
    this.calculator = calculator;

    this.isHistoryActive = false;

    this.inputsContainer = this.root.querySelector('.calculator__inputs');
    this.historyButton = document.querySelector('.calculator__history');

    this.inputValues = [7, 8, 9, 'DEL', 4, 5, 6, '+', 1, 2, 3, '-', '.', 0, '/', 'x', 'RESET', '='];
  }

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

  generateInputButtons = () => {
    const inputs = this.inputValues
      .map(
        input => `
        <li>
          <button class="${App.setInputClass(input)}" data-type=${App.setInputDataType(
          input,
        )} data-value=${input}>${input}</button>
        </li>
      `,
      )
      .join('');

    return inputs;
  };

  handleHistoryClick = () => {
    this.historyButton.addEventListener('click', () => {
      const { calculator, inputsContainer, toggleHistoryView } = this;

      if (!calculator.history.slice(1).length) return;

      inputsContainer.innerHTML = '';

      inputsContainer.classList.toggle('inputs-grid');
      inputsContainer.classList.toggle('history');

      toggleHistoryView();
    });
  };

  toggleHistoryView = () => {
    const { calculator, inputsContainer, generateInputButtons } = this;

    if (!this.isHistoryActive) {
      inputsContainer.insertAdjacentHTML(
        'afterbegin',
        App.generateHistoryMarkup(calculator.history),
      );

      this.isHistoryActive = true;
    } else {
      inputsContainer.insertAdjacentHTML('afterbegin', generateInputButtons());

      this.isHistoryActive = false;
    }
  };

  static generateHistoryMarkup(history) {
    return `
      <ul>
          ${history
            .slice(1)
            .map(
              item => `
              <li>
                  <button data-result=${item.result}>${item.firstOperand} ${item.operation} ${item.secondOperand}</button>
              </li>
            `,
            )
            .join('')}
      </ul>
    `;
  }

  handleHistoryItemClick = () => {
    this.inputsContainer.addEventListener('click', event => {
      const { result } = event.target.dataset;
      if (!result) return;

      this.calculator.tempField.innerHTML = `${event.target.innerHTML} =`;
      this.calculator.initValues().handleNumberType(result);
    });
  };

  render() {
    const {
      inputsContainer,
      generateInputButtons,
      calculator,
      handleHistoryClick,
      handleHistoryItemClick,
    } = this;

    inputsContainer.insertAdjacentHTML('afterbegin', generateInputButtons());
    calculator.run();

    handleHistoryClick();
    handleHistoryItemClick();
  }
}
