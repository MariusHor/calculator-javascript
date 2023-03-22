import { ViewMain, ViewHistory, ViewResults } from '@views';

import './App.scss';

export default class App {
  constructor(model) {
    this.viewMain = new ViewMain(model);
    this.viewHistory = new ViewHistory(model);
    this.viewResults = new ViewResults(model);

    this.model = model;
  }

  handleUserInput = (type, value) => {
    if (type === 'symbol') {
      this.handleSymbolType(value);
    } else this.handleNumberType(value);
  };

  handleSymbolType = symbol => {
    switch (symbol) {
      case 'RESET':
        this.model.handleReset();
        break;
      case '=':
        this.model.handleEquals();
        break;
      case 'DEL':
        this.model.handleDel();
        break;
      case '.':
        this.model.handleDecimal();
        break;
      default:
        this.model.handleMath(symbol);
    }
  };

  handleNumberType = value => {
    this.model.setCurrentOperand(value);
  };

  handleHistoryItemClick = id => {
    this.transitionViewSwitch();
    this.model.setValues(id).publishValues();
  };

  transitionViewSwitch = () => {
    const { viewMain, setActiveView, model } = this;
    const isHistoryViewActive = model.toggleHistoryViewStatus();

    setTimeout(() => {
      viewMain.toggleContainer();
      setActiveView(isHistoryViewActive);
    }, 600);

    viewMain.toggleContainerOpacity();
  };

  setActiveView = isHistoryViewActive => {
    if (isHistoryViewActive) {
      this.model.publishHistory();
    } else this.viewMain.render();
  };

  render() {
    const { transitionViewSwitch, handleHistoryItemClick, viewHistory, viewMain } = this;

    viewMain.render();

    viewMain.bindUserInput(this.handleUserInput);
    viewHistory.bindHistoryBtnClick(transitionViewSwitch);
    viewHistory.bindHistoryItemClick(handleHistoryItemClick);
  }
}
