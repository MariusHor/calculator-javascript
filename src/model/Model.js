/* eslint-disable no-useless-catch */
import { randomId, formatOperand } from '@utils';
import { MAX_HISTORY_LENGTH, ID_LENGTH } from '@constants';
import PubSub from './PubSub';

export default class Model {
  constructor() {
    this.prevOperand = 0;
    this.currentOperand = '';
    this.prevOperator = null;
    this.isHistoryActive = false;

    this.isWaitingForSymbol = true;

    this.history = [];

    this.subscriptionManager = new PubSub();
    this.publish = this.subscriptionManager.publish;
    this.subscribe = this.subscriptionManager.subscribe;
  }

  publishValues() {
    this.publish('result', {
      prevOperand: formatOperand(this.prevOperand),
      currentOperand: formatOperand(this.currentOperand),
      operator: this.prevOperator,
    });
  }

  setCurrentOperand = value => {
    if (this.isWaitingForSymbol) {
      this.currentOperand = value;
    } else
      this.currentOperand = this.currentOperand === '0' ? value : (this.currentOperand += value);

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

  handleDel = () => {
    this.currentOperand = formatOperand(this.currentOperand).toString().slice(0, -1);

    this.publishValues();
  };

  handleDecimal() {
    this.currentOperand = this.currentOperand.toString().includes('.')
      ? this.currentOperand
      : (this.currentOperand += '.');

    this.publishValues();
  }

  saveHistory() {
    this.history = this.history.length >= MAX_HISTORY_LENGTH ? this.history.slice(1) : this.history;

    this.history = [
      ...this.history,
      {
        id: randomId(ID_LENGTH),
        prevOperand: formatOperand(this.prevOperand),
        currentOperand: formatOperand(this.currentOperand),
        operator: this.prevOperator,
      },
    ];
  }

  publishHistory() {
    this.publish('history', this.history);
  }

  setValuesfromHistory(id) {
    const historyItem = this.history.find(item => item.id === id);

    this.prevOperand = +historyItem.prevOperand;
    this.prevOperator = historyItem.operator;
    this.currentOperand = historyItem.currentOperand;

    this.isWaitingForSymbol = false;

    return this;
  }

  toggleHistoryViewStatus() {
    this.isHistoryActive = !this.isHistoryActive;
    return this.isHistoryActive;
  }
}
