import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import userReducer from './userSlice';
import { inStorage, fromStorage, clearStorage } from '@/lib'; // Assuming these functions are in storage.js

// Custom storage engine using cookies with Promises
const cookieStorage = {
  getItem: (key) => {
    return Promise.resolve(fromStorage(key));
  },
  setItem: (key, value) => {
    return Promise.resolve(inStorage(key, value)); 
  },
  removeItem: (key) => {
    return Promise.resolve(clearStorage(key));
  }
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage: cookieStorage, // Use the custom cookie storage engine
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
