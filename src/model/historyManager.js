import { randomId, formatOperand } from '@utils';
import { MAX_HISTORY_LENGTH, ID_LENGTH } from '@constants';
import PubSub from './PubSub';

export default class HistoryManager {
  constructor() {
    this.prevOperand = 0;
    this.currentOperand = '';
    this.prevOperator = null;
    this.isHistoryActive = false;

    this.history = [];

    this.subManager = new PubSub();
    this.publish = this.subManager.publish;
    this.subscribe = this.subManager.subscribe;
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
