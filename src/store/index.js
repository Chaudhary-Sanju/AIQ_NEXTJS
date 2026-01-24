import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import userReducer from "./userSlice";
import { inStorage, fromStorage, clearStorage } from "@/lib";

// IMPORTANT: only use this storage in the browser
const cookieStorage = {
  getItem: (key) => Promise.resolve(fromStorage(key)),
  setItem: (key, value) => Promise.resolve(inStorage(key, value)),
  removeItem: (key) => Promise.resolve(clearStorage(key)),
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage: cookieStorage,
  whitelist: ["user"], // recommended: only persist what you need
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // redux-persist stores non-serializable stuff
      }),
  });
}
