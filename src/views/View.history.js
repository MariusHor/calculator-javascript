import View from './View';

export default class ViewHistory extends View {
  constructor(model) {
    super();
    model.subscribe('history', this.render);
  }

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
    this.$.historyButton.addEventListener('click', () => {
      callback();
    });
  };

  bindHistoryItemClick = callback => {
    this.$.mainContainer.addEventListener('click', event => {
      const { id } = event.target.dataset;
      if (!id) return;

      callback(id);
    });
  };

  render = history => {
    this.$.mainContainer.insertAdjacentHTML(
      'afterbegin',
      ViewHistory.generateHistoryMarkup(history),
    );
  };
}
