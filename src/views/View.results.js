import View from './View';

export default class ViewResults extends View {
  constructor(model) {
    super();
    model.subscribe('result', this.render);
    model.subscribe('error', this.render);
  }

  toggleResultFieldClasses(state) {
    if (state.error) {
      this.$.resultField.classList.remove('header--l');
      this.$.resultField.classList.add('header--m');
    } else {
      this.$.resultField.classList.add('header--l');
      this.$.resultField.classList.remove('header--m');
    }
  }

  static validatePrevOperand(operand) {
    if (operand === '0' || operand === undefined) {
      return '';
    }
    return operand;
  }

  static validateCurrentOperand(operand) {
    if (operand === '') {
      return 0;
    }
    return operand;
  }

  render = state => {
    this.toggleResultFieldClasses(state);

    const currOp = ViewResults.validateCurrentOperand(state.currentOperand);
    const prevOp = ViewResults.validatePrevOperand(state.prevOperand);

    this.$.resultField.innerHTML = state.error || currOp;
    this.$.tempField.innerHTML = prevOp + (state.operator || '');
  };
}
