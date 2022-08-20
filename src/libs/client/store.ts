import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import {
  nextReduxCookieMiddleware,
  wrapMakeStore,
  SERVE_COOKIES,
} from 'next-redux-cookie-wrapper'
import LogRocket from 'logrocket'
import rootReducer from './slices'
import {
  currentEnv,
  reduxCookiePersist,
  trackingSettings,
} from '../../../site.config'

const store = configureStore({
  devTools: currentEnv !== 'production',
  middleware: (getDefaultMiddleware) => {
    let middleware = getDefaultMiddleware({
      serializableCheck: {
        // https://github.com/bjoluc/next-redux-cookie-wrapper#usage-with-redux-toolkit
        ignoredActions: [SERVE_COOKIES],
      },
    })
    if (reduxCookiePersist.enabled) {
      middleware.unshift(
        nextReduxCookieMiddleware({
          domain: '.dazedbear.pro',
          maxAge: 86400,
          sameSite: true,
          secure: true,
          subtrees: reduxCookiePersist.stateSubTrees,
        })
      )
    }
    if (trackingSettings.logRocket.enable) {
      middleware.push(LogRocket.reduxMiddleware())
    }
    return middleware
  },
  reducer: rootReducer,
})

export default createWrapper(wrapMakeStore(() => store))

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
