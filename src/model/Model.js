import { randomId, setMaxOperandLength } from '@utils';
import { MAX_OPERAND_LENGTH, MAX_HISTORY_LENGTH, ID_LENGTH } from '@constants';
import PubSub from './PubSub';

export default class Model {
  constructor() {
    this.prevOperand = 0;
    this.currentOperand = '';
    this.prevOperator = null;
    this.isHistoryActive = false;

    this.history = [];

    this.subscriptionManager = new PubSub();
    this.publish = this.subscriptionManager.publish;
    this.subscribe = this.subscriptionManager.subscribe;
  }

  publishHistory() {
    this.publish('history', this.history);
  }

  publishValues() {
    this.publish('result', {
      prevOperand: setMaxOperandLength(this.prevOperand, MAX_OPERAND_LENGTH),
      currentOperand: setMaxOperandLength(this.currentOperand, MAX_OPERAND_LENGTH),
      operator: this.prevOperator,
    });
  }

  saveHistory() {
    this.history = this.history.length >= MAX_HISTORY_LENGTH ? this.history.slice(1) : this.history;

    this.history = [
      ...this.history,
      {
        id: randomId(ID_LENGTH),
        prevOperand: this.prevOperand,
        currentOperand: this.currentOperand,
        operator: this.prevOperator,
      },
    ];
  }

  setCurrentOperand = value => {
    this.currentOperand = this.currentOperand === '0' ? value : (this.currentOperand += value);
    this.publishValues();
  };

  operate = currentOperand => {
    if (this.prevOperator === '+') {
      this.saveHistory();
      this.prevOperand += currentOperand;
    }
    if (this.prevOperator === '-') {
      this.saveHistory();
      this.prevOperand -= currentOperand;
    }
    if (this.prevOperator === 'x') {
      this.saveHistory();
      this.prevOperand *= currentOperand;
    }
    if (this.prevOperator === '/') {
      this.saveHistory();
      this.prevOperand /= currentOperand;
    }
  };

  handleMath = symbol => {
    if (this.currentOperand === '0') return;

    if (this.prevOperand === 0) {
      this.prevOperand = parseFloat(this.currentOperand);
    } else {
      this.operate(parseFloat(this.currentOperand));
    }

    this.prevOperator = symbol;
    this.publishValues();

    this.currentOperand = '0';
  };

  handleReset = () => {
    this.currentOperand = '0';
    this.prevOperand = 0;

    this.publishValues();
  };

  handleEquals = () => {
    if (!this.prevOperator) return;

    this.operate(parseFloat(this.currentOperand));

    this.currentOperand = this.prevOperand;
    this.prevOperator = null;

    this.publishValues();

    this.prevOperand = 0;
  };

  handleDel = () => {
    this.currentOperand =
      this.currentOperand.length === 1
        ? '0'
        : setMaxOperandLength(this.currentOperand, MAX_OPERAND_LENGTH).toString().slice(0, -1);

    this.publishValues();
  };

  handleDecimal() {
    this.currentOperand = !this.currentOperand.includes('.')
      ? (this.currentOperand += '.')
      : this.currentOperand;

    this.publishValues();
  }

  setValues(id) {
    const historyItem = this.history.find(item => item.id === id);

    this.prevOperand = historyItem.prevOperand;
    this.prevOperator = historyItem.operator;
    this.currentOperand = historyItem.currentOperand;

    return this;
  }

  toggleHistoryViewStatus() {
    this.isHistoryActive = !this.isHistoryActive;
    return this.isHistoryActive;
  }
}
