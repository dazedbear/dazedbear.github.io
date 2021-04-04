import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './slices'

const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer: rootReducer,
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
