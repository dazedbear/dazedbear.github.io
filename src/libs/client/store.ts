import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import {
  nextReduxCookieMiddleware,
  wrapMakeStore,
} from 'next-redux-cookie-wrapper'
import LogRocket from 'logrocket'
import rootReducer from './slices'

const store = configureStore({
  devTools: process.env.NEXT_PUBLIC_APP_ENV !== 'production',
  middleware: [
    nextReduxCookieMiddleware({
      domain: '.dazedbear.pro',
      maxAge: 86400,
      sameSite: true,
      secure: true,
      subtrees: ['stream'],
    }),
    ...getDefaultMiddleware(),
    LogRocket.reduxMiddleware(),
  ],
  reducer: rootReducer,
})

export default createWrapper(wrapMakeStore(() => store))

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
