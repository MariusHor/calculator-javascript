import View from './View';

export default class ViewResults extends View {
  constructor(model) {
    super();
    model.subscribe('result', this.render);
  }

  render = state => {
    this.$.resultField.innerHTML = state.currentOperand;
    this.$.tempField.innerHTML =
      state.prevOperand === '0' ? state.currentOperand : state.prevOperand + (state.operator || '');
  };
}
