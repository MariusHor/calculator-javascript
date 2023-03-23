import { getEl } from '@utils';
import { THEME_CLASSES } from '../constants';

export default class ViewTheme {
  $ = {
    root: getEl('#root'),
    themeSwitch: getEl('.theme-switch'),
    themes: getEl('.theme-input', { all: true }),
  };

  toggleActiveClass(element) {
    this.$.themes.forEach(theme => {
      theme.classList.remove('active');
    });

    element.classList.add('active');
  }

  toggleTheme(id) {
    this.$.root.classList.remove(...THEME_CLASSES);
    this.$.root.classList.add(id);
  }

  bindThemeClick = () => {
    this.$.themeSwitch.addEventListener('click', event => {
      const element = event.target.closest('.button');
      if (!element) return;

      this.toggleActiveClass(element);
      this.toggleTheme(element.id);
    });
  };
}
