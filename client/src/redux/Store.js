import { combineReducers, configureStore } from "@reduxjs/toolkit";
import useReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // this saves local storage in the browser

const rootReducer = combineReducers({ user: useReducer });

const persistConfig = {
  key: "root", // name data that we will store in local storage
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //prevent errors from appearing when using redux toolkit
    }),
});

export const persistor = persistStore(store); // save in local store
