import { MAX_OPERAND_LENGTH } from '@constants';

export const getEl = selector => document.querySelector(selector);

export const toggleClasses = (element, classes) => {
  classes.forEach(item => {
    element.classList.toggle(item);
  });
};

export const randomId = (length = 6) =>
  Math.random()
    .toString(36)
    .substring(2, length + 2);

export const setMaxOperandLength = (operand, length) => operand.toString().slice(0, length);

export const formatOperand = operand => setMaxOperandLength(operand, MAX_OPERAND_LENGTH);
