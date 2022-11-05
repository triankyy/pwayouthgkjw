import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userApi } from '../services/users.service';
import userSlice from './userSlice';

const reducers = combineReducers({
	user: userSlice,
	[userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer({ key: 'root', whitelist: ['user'], storage }, reducers);
export const store = configureStore({ 
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware()
			.concat([
				userApi.middleware,
			]);
	}
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>