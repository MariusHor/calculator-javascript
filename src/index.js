import Model from '@model';
import App from './App';

import '@styles/main.scss';

const model = new Model();
const app = new App(model);

app.render();
