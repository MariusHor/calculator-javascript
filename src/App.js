import './App.scss';

export default class App {
  constructor(root) {
    this.root = root;
  }

  render() {
    const { root } = this;

    const h1 = document.createElement('h1');
    h1.textContent = 'Boilerplate';

    root.append(h1);
  }
}
