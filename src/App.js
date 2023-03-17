import './App.scss';

export default class App {
  constructor(root) {
    this.root = root;

    this.inputsContainer = this.root.querySelector('.calculator__inputs');
    this.inputValues = [7, 8, 9, 'DEL', 4, 5, 6, '+', 1, 2, 3, '-', '.', 0, '/', 'x', 'RESET', '='];
  }

  setInputClass(input) {
    switch (input) {
      case 'DEL':
      case 'RESET': {
        return 'button button--grey';
      }
      case '=': {
        return 'button button--orange';
      }
      default:
        return 'button button--beige';
    }
  }

  generateInputButtons = () => {
    const inputs = this.inputValues
      .map(
        input => `
        <li>
          <button class="${this.setInputClass(input)}">${input}</button>
        </li>
      `,
      )
      .join('');

    return inputs;
  };

  render() {
    const { inputsContainer, generateInputButtons } = this;

    inputsContainer.insertAdjacentHTML('afterbegin', generateInputButtons());
  }
}
