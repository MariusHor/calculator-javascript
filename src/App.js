import ViewHistory from './View.history';
import ViewMain from './View.main';

import './App.scss';

export default class App {
  constructor() {
    this.viewMain = new ViewMain();
    this.viewHistory = new ViewHistory();

    this.store = {
      isHistoryActive: false,
    };
  }

  setActiveView = () => {
    const { store, viewHistory, viewMain } = this;

    if (store.isHistoryActive) {
      viewHistory.render([]);
    } else viewMain.render();
  };

  handleHistoryBtnClick = () => {
    // IF NO HISTORY => RETURN
    this.viewMain.transitionViewSwitch(this.setActiveView);
  };

  handleHistoryItemClick = result => {
    // RESET STORE VALUES
    this.viewMain.transitionViewSwitch().updateDisplay(result);
  };

  render() {
    const { handleHistoryBtnClick, handleHistoryItemClick, viewHistory, viewMain } = this;

    viewMain.render();
    viewHistory.bindHistoryBtnClick(handleHistoryBtnClick);
    viewHistory.bindHistoryItemClick(handleHistoryItemClick);
  }
}
