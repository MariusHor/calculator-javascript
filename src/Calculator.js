import { setMaxDecimals } from './utils';

export default class Calculator {
  constructor() {
    this.calculatorContainer = document.querySelector('.calculator');
    this.inputsContainer = document.querySelector('.calculator__inputs');
    this.resultbar = document.querySelector('.calculator__result-bar');
    this.resultField = document.querySelector('.calculator__result');
    this.tempField = document.querySelector('.calculator__temp-result');

    this.history = [];
  }

  initValues() {
    this.currentInput = '';
    this.prevInput = null;
    this.currentOperation = null;

    return this;
  }

  handleNumberType = value => {
    if (this.currentInput.length > 10) {
      this.resultField.classList.remove('header--l');
      this.resultField.classList.add('header--m');
    }

    if (this.currentInput.length > 14) return;

    if (value !== '.' || (value === '.' && !this.currentInput.includes('.'))) {
      this.currentInput += value;
      this.resultField.innerHTML = this.currentInput;
    }
  };

  handleOperationType = value => {
    if (this.currentInput === '.') return;

    if (!this.prevInput) {
      this.prevInput = this.currentInput;
      this.currentInput = value === '/' || value === 'x' ? 1 : 0;
    }

    this.currentOperation = value;

    this.operate(+this.prevInput, +this.currentInput, this.prevOperation);

    this.prevOperation = this.currentOperation;
    this.currentInput = '';

    this.updateDisplay();
  };

  handleActionType = value => {
    if (value === 'RESET') {
      this.initValues();
      this.resultField.innerHTML = '0';
      this.tempField.innerHTML = '';
    }

    if (value === 'DEL') {
      if (this.currentInput.length < 10) {
        this.resultField.classList.remove('header--m');
        this.resultField.classList.add('header--l');
      }

      this.currentInput = this.currentInput.slice(0, -1);
      this.resultField.innerHTML = this.currentInput || '0';
    }
  };

  handleUserInput = () => {
    this.inputsContainer.addEventListener('click', event => {
      const userInput = event.target;
      if (!userInput) return;

      const { value, type } = userInput.dataset;

      if (type === 'number') {
        this.handleNumberType(value);
      }

      if (type === 'operation') {
        this.handleOperationType(value);
      }

      if (type === 'action') {
        this.handleActionType(value);
      }
    });
  };

  operate(firstOperand, secondOperand, operation = this.currentOperation) {
    switch (operation) {
      case '+': {
        this.result = firstOperand + secondOperand;
        break;
      }
      case '-': {
        this.result = firstOperand - secondOperand;
        break;
      }
      case '/': {
        this.result = firstOperand / secondOperand;
        break;
      }
      case 'x': {
        this.result = firstOperand * secondOperand;
        break;
      }
      default:
        this.result = firstOperand;
    }

    if (operation !== '=') {
      this.saveHistory(operation, firstOperand, secondOperand, this.result);
    }

    this.prevInput = this.result;
  }

  saveHistory(operation, firstOperand, secondOperand) {
    this.history = this.history.length > 6 ? this.history.slice(1) : this.history;
    this.history = [
      ...this.history,
      {
        firstOperand,
        operation,
        secondOperand,
        result: this.result,
      },
    ];
  }

  updateDisplay() {
    this.resultField.innerHTML = setMaxDecimals(this.result);
    this.tempField.innerHTML = `${setMaxDecimals(this.result)} ${this.currentOperation}`;
  }

  run = () => {
    this.initValues();
    this.handleUserInput();
  };
}
