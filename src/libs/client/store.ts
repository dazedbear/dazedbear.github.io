import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import LogRocket from 'logrocket'
import rootReducer from './slices'

const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  middleware: [...getDefaultMiddleware(), LogRocket.reduxMiddleware()],
  reducer: rootReducer,
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
