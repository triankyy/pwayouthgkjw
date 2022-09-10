import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from './userSlice';

const reducers = combineReducers({
	user: userSlice
});

const persistedReducer = persistReducer({ key: 'root', storage }, reducers);
export const store = configureStore({ reducer: persistedReducer });
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>