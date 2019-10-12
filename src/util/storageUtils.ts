export const getItemJson = (
  storage = localStorage,
  key,
  defaultValue = {},
  isErrorThrow = false
) => {
  const cachedValue = storage.getItem(key);
  try {
    return JSON.parse(cachedValue) || defaultValue;
  } catch (err) {
    if (isErrorThrow) {
      throw err;
    }
    return defaultValue;
  }
};
