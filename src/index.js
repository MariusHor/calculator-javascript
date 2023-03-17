import App from './App';
import Calculator from './Calculator';
import '@styles/main.scss';

const root = document.querySelector('#root');

const calculator = new Calculator();
const app = new App({ root, calculator });

app.render();
