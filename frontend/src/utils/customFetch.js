import { getFromLocalStorage } from "./localStorage";

// http://fall2024-comp307-group09.cs.mcgill.ca:5000/api
const BASE_URL = "http://fall2024-comp307-group09.cs.mcgill.ca:5000/api";

function customFetch(url, options) {
  const user = getFromLocalStorage("user");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: user ? `Bearer ${user.token}` : "",
    },
  };
  options = { ...defaultOptions, ...options };

  // remove headers if body is image data, to allow fetch to set the correct headers itself
  if (options.body instanceof FormData) delete options.headers["Content-Type"];

  return fetch(BASE_URL + url, options)
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg);
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
}

export default customFetch;
