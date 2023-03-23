import { getEl } from '@utils';

export default class View {
  $ = {
    root: getEl('#root'),
    mainContainer: getEl('.calculator__main'),
    historyButton: getEl('.button--history'),
    calculatorContainer: getEl('.calculator'),
    themeSwitch: getEl('.theme-switch'),
    themes: getEl('.theme-input', { all: true }),
    inputsContainer: getEl('.calculator__main'),
    resultbar: getEl('.calculator__result-bar'),
    resultField: getEl('.calculator__result'),
    tempField: getEl('.calculator__temp-result'),
  };
}
