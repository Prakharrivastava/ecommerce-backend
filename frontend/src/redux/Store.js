import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './userSlice'
import cartReducer from "./cartSlice";

// Vite default import fix
const storageEngine = storage.default || storage

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage: storageEngine,
  whitelist: ['user', 'cart'], // Page refresh hone par user aur cart dono ka data save rahega
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export default store