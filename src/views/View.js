import { getEl } from '@utils';

export default class View {
  $ = {
    mainContainer: getEl('.calculator__main'),
    historyButton: getEl('.button--history'),
    calculatorContainer: getEl('.calculator'),
    inputsContainer: getEl('.calculator__main'),
    resultbar: getEl('.calculator__result-bar'),
    resultField: getEl('.calculator__result'),
    tempField: getEl('.calculator__temp-result'),
  };
}
