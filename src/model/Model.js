/* eslint-disable no-useless-catch */
import { formatOperand } from '@utils';
import HistoryManager from './historyManager';

export default class Model extends HistoryManager {
  constructor() {
    super();
    this.isWaitingForSymbol = true;
  }

  publishValues() {
    this.publish('result', {
      prevOperand: formatOperand(this.prevOperand),
      currentOperand: formatOperand(this.currentOperand),
      operator: this.prevOperator,
    });
  }

  setCurrentOperand = value => {
    if (this.isWaitingForSymbol || this.currentOperand === '0') {
      this.currentOperand = value;
    } else this.currentOperand += value;

    this.isWaitingForSymbol = false;
    this.publishValues();
  };

  operate = currentOperand => {
    try {
      switch (this.prevOperator) {
        case '+':
          this.saveHistory();
          this.prevOperand += currentOperand;
          break;
        case '-':
          this.saveHistory();
          this.prevOperand -= currentOperand;
          break;
        case '*':
          this.saveHistory();
          this.prevOperand *= currentOperand;
          break;
        case '/':
          this.saveHistory();
          if (currentOperand === 0) throw new Error('Cannot divide by 0');
          this.prevOperand /= currentOperand;
          break;
        default:
          this.prevOperand = currentOperand;
      }
    } catch (error) {
      throw error;
    }
  };

  handleSymbol = symbol => {
    if (!this.currentOperand) return;

    if (this.isWaitingForSymbol) {
      this.prevOperator = symbol;
      this.currentOperand = this.prevOperand;

      this.publishValues();
    } else {
      this.handleMath(symbol);
    }
  };

  handleMath = symbol => {
    try {
      if (this.prevOperand === 0) {
        this.prevOperand = parseFloat(this.currentOperand);
      } else {
        this.operate(parseFloat(this.currentOperand));
      }

      this.prevOperator = symbol;
      this.publishValues();

      this.currentOperand = '0';
      this.isWaitingForSymbol = true;
    } catch (error) {
      this.handleReset().publish('error', {
        error: error.message,
      });
    }
  };

  handleReset = () => {
    this.currentOperand = '';
    this.prevOperand = 0;
    this.prevOperator = null;
    return this;
  };

  handleEquals = () => {
    if (!this.prevOperator || !this.currentOperand || this.isWaitingForSymbol) return;

    try {
      this.operate(parseFloat(this.currentOperand));

      this.currentOperand = this.prevOperand;
      this.prevOperator = null;

      this.publishValues();

      this.prevOperand = 0;
    } catch (error) {
      this.handleReset().publish('error', {
        error: error.message,
      });
    }
  };

  handleDelete = () => {
    this.currentOperand = formatOperand(this.currentOperand).toString().slice(0, -1);

    this.publishValues();
  };

  handleDecimal() {
    this.currentOperand = this.currentOperand.toString().includes('.')
      ? this.currentOperand
      : (this.currentOperand += '.');

    this.publishValues();
  }
}
