import MAX_RESULT_LENGTH from '@constants/constants';

export const setMaxDecimals = number => {
  if (!Number.isInteger(number)) {
    const index = number.toString().indexOf('.');

    if (number.toString().slice(index).length > 5) return number.toFixed(MAX_RESULT_LENGTH - index);
  }
  return number;
};

export const removeChild = (root, selector) => {
  const el = root.querySelector(selector);
  if (el) root.removeChild(el);
};
