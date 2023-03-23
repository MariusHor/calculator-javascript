import View from './View';

export default class ViewTheme extends View {
  #themeClasses = ['theme--platinum', 'theme--tealish-blue', 'theme--haiti'];

  toggleActiveClass(element) {
    this.$.themes.forEach(theme => {
      theme.classList.remove('active');
    });

    element.classList.add('active');
  }

  toggleTheme(id) {
    this.$.root.classList.remove(...this.#themeClasses);
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
