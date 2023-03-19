import { setMaxDecimals } from './utils';
import MAX_RESULT_LENGTH from './constants/constants';

export default class Calculator {
  constructor() {
    this.calculatorContainer = document.querySelector('.calculator');
    this.inputsContainer = document.querySelector('.calculator__main');
    this.resultbar = document.querySelector('.calculator__result-bar');
    this.resultField = document.querySelector('.calculator__result');
    this.tempField = document.querySelector('.calculator__temp-result');

    this.history = [];
  }

  initValues() {
    this.currentInput = '';
    this.prevInput = null;
    this.currentOperation = null;

    this.resultField.classList.remove('header--m');
    this.resultField.classList.add('header--l');

    return this;
  }

  setCurrentInput(value) {
    this.currentInput = value;
  }

  handleNumberType = value => {
    if (this.currentInput.length > 8) {
      this.resultField.classList.remove('header--l');
      this.resultField.classList.add('header--m');
    }

    if (this.currentInput.length > MAX_RESULT_LENGTH) return;

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
    this.updateDisplay(this.result, this.currentOperation);

    this.prevOperation = this.currentOperation;
    this.currentInput = '';
  };

  handleActionType = value => {
    if (value === 'RESET') {
      this.initValues();
      this.resultField.innerHTML = '0';
      this.tempField.innerHTML = '';
    }

    if (value === 'DEL') {
      if (this.currentInput.length < 8) {
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

    const formattedResult = setMaxDecimals(this.result);
    this.prevInput = formattedResult;

    if (secondOperand !== 0 && operation !== '=') {
      this.saveHistory(operation, firstOperand, secondOperand, formattedResult);
    }
  }

  saveHistory(operation, firstOperand, secondOperand, result) {
    this.history = this.history.length > 5 ? this.history.slice(1) : this.history;
    this.history = [
      ...this.history,
      {
        firstOperand,
        operation,
        secondOperand,
        result,
      },
    ];
  }

  updateDisplay(input, operation = '=') {
    const result = setMaxDecimals(input);

    if (result.length > 8) {
      this.resultField.classList.remove('header--l');
      this.resultField.classList.add('header--m');
    }

    this.resultField.innerHTML = result;
    this.tempField.innerHTML = `${result} ${operation}`;
  }

  run = () => {
    this.initValues();
    this.handleUserInput();
  };
}
