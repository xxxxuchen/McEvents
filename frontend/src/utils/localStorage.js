export const addToLocalStorage = (key, item) => {
  localStorage.setItem(key, JSON.stringify(item));
};
export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
export const getFromLocalStorage = (key) => {
  const result = localStorage.getItem(key);
  if (!result) return null;
  const user = JSON.parse(result);
  return user;
};
