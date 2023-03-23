import { getEl } from '@utils';

export default class ViewHistory {
  constructor(model) {
    model.subscribe('history', this.render);
  }

  $ = {
    mainContainer: getEl('.calculator__main'),
    historyButton: getEl('.button--history'),
  };

  static generateHistoryMarkup = data => `
          <ul>
              ${data
                .map(
                  item => `
                  <li>
                      <button class="button" data-id=${item.id}>${item.prevOperand} ${item.operator} ${item.currentOperand}</button>
                  </li>
                `,
                )
                .join('')}
          </ul>
        `;

  bindHistoryBtnClick = callback => {
    this.$.historyButton.addEventListener('click', callback);
  };

  bindHistoryItemClick = callback => {
    this.$.mainContainer.addEventListener('click', callback);
  };

  render = history => {
    this.$.mainContainer.insertAdjacentHTML(
      'afterbegin',
      ViewHistory.generateHistoryMarkup(history),
    );
  };
}
