import { getEl } from './utils';

export default class ViewHistory {
  $ = {
    mainContainer: getEl('.calculator__main'),
    historyButton: getEl('.button--history'),
  };

  static generateHistoryMarkup = data => `
          <ul>
              ${data
                .slice(1)
                .map(
                  item => `
                  <li>
                      <button class="button" data-result=${item.result}>${item.firstOperand} ${item.operation} ${item.secondOperand}</button>
                  </li>
                `,
                )
                .join('')}
          </ul>
        `;

  bindHistoryBtnClick = callback => {
    this.$.historyButton.addEventListener('click', () => {
      callback();
    });
  };

  bindHistoryItemClick = callback => {
    this.$.mainContainer.addEventListener('click', event => {
      const { result } = event.target.dataset;
      if (!result) return;

      callback(result);
    });
  };

  render = data => {
    const { mainContainer } = this.$;
    const { generateHistoryMarkup } = ViewHistory;

    mainContainer.insertAdjacentHTML('afterbegin', generateHistoryMarkup(data));
  };
}
