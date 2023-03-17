import './App.scss';

export default class App {
  constructor({ root, calculator }) {
    this.root = root;
    this.calculator = calculator;

    this.isHistoryActive = false;

    this.mainContainer = this.root.querySelector('.calculator__main');
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

    return `
            <ul class="main-grid">${inputs}</ul>
    `;
  };

  handleHistoryClick = () => {
    this.historyButton.addEventListener('click', () => {
      const { calculator, transitionViewSwitch } = this;

      if (!calculator.history.slice(1).length) return;

      transitionViewSwitch();
    });
  };

  transitionViewSwitch = () => {
    const { mainContainer, toggleHistoryView } = this;

    setTimeout(() => {
      mainContainer.innerHTML = '';

      mainContainer.classList.toggle('main-grid');
      mainContainer.classList.toggle('history');
      mainContainer.classList.toggle('opacity');

      toggleHistoryView();
    }, 700);

    mainContainer.classList.toggle('opacity');
  };

  toggleHistoryView = () => {
    const { calculator, mainContainer, generateInputButtons } = this;

    if (!this.isHistoryActive) {
      mainContainer.insertAdjacentHTML('afterbegin', App.generateHistoryMarkup(calculator.history));

      this.isHistoryActive = true;
    } else {
      mainContainer.insertAdjacentHTML('afterbegin', generateInputButtons());

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
    this.mainContainer.addEventListener('click', event => {
      const { result } = event.target.dataset;
      if (!result) return;

      this.calculator.tempField.innerHTML = `${event.target.innerHTML} =`;
      this.calculator.initValues().handleNumberType(result);

      this.transitionViewSwitch();
    });
  };

  render() {
    const {
      mainContainer,
      generateInputButtons,
      calculator,
      handleHistoryClick,
      handleHistoryItemClick,
    } = this;

    mainContainer.insertAdjacentHTML('afterbegin', generateInputButtons());
    calculator.run();

    handleHistoryClick();
    handleHistoryItemClick();
  }
}
