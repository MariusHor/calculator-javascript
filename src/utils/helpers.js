import MAX_DECIMALS from '@constants/constants';

export const setMaxDecimals = number => {
  if (!Number.isInteger(number)) {
    const { length } = number.toString();
    const result = length > MAX_DECIMALS ? number.toFixed(MAX_DECIMALS) : number;
    return result;
  }
  return number;
};

export const removeChild = (root, selector) => {
  const el = root.querySelector(selector);
  if (el) root.removeChild(el);
};
