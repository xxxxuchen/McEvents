import { createContext, useContext, useReducer } from "react";
import {
  addToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../utils/localStorage";

const UserContext = createContext();

const initialState = {
  user: getFromLocalStorage("user") || null,
  isLoggingOut: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cancel":
      return { ...state, isLoading: false };
    case "update/user":
      addToLocalStorage("user", action.payload);
      return { ...state, user: action.payload, isLoading: false };
    case "auth/register":
      addToLocalStorage("user", action.payload);
      return { ...state, user: action.payload, isLoading: false };
    case "auth/login":
      addToLocalStorage("user", action.payload);
      return { ...state, user: action.payload, isLoading: false };
    case "auth/logout":
      removeFromLocalStorage("user");
      return { ...state, user: null, isLoggingOut: false };
    case "error":
      return { ...state, user: null, isLoading: false };
    default:
      throw new Error("Unknown action type");
  }
}

function UserProvider({ children }) {
  const [{ user, isLoading, isLoggingOut }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isLoggingOut,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("UserContext was used outside the UserProvider");
  return context;
}

export { UserProvider, useUser };
