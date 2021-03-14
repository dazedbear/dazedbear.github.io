import React, { useReducer, useContext, createContext } from 'react'

interface SiteContext {
  activeSectionId: string
  showNavMenu: boolean
  showTableOfContent: boolean
  device: 'smartphone' | 'desktop'
  dispatch?: any
  viewport: {
    height: number
    width: number
  }
}

const defaultSiteContext: SiteContext = {
  activeSectionId: '',
  showNavMenu: false,
  showTableOfContent: false,
  device: 'smartphone',
  viewport: {
    height: 0,
    width: 0,
  },
}

const ctx = createContext<SiteContext>(defaultSiteContext)

const SiteContextReducer = (state, { type, payload }) => {
  switch (type) {
    case 'TOGGLE_NAV_MENU': {
      const showNavMenu =
        typeof payload === 'boolean' ? payload : !state.showNavMenu
      return Object.assign({}, state, { showNavMenu })
    }
    case 'TOGGLE_TABLE_OF_CONTENT': {
      const showTableOfContent =
        typeof payload === 'boolean' ? payload : !state.showTableOfContent
      return Object.assign({}, state, { showTableOfContent })
    }
    case 'UPDATE_VIEWPORT': {
      const { height, width } = payload
      if (typeof height !== 'number' || typeof width !== 'number') {
        return state
      }
      return Object.assign({}, state, { viewport: { height, width } })
    }
    case 'UPDATE_DEVICE': {
      const { device } = payload
      const valid = ['smartphone', 'desktop']
      if (!valid.includes(device)) {
        return state
      }
      return Object.assign({}, state, { device })
    }
    case 'UPDATE_TOC_ACTIVE_SECTION_ID': {
      if (typeof payload !== 'string' || payload.length !== 32) {
        return state
      }
      return Object.assign({}, state, { activeSectionId: payload })
    }
    default: {
      return state
    }
  }
}

export const SiteContextAction = (type: string, payload?: any) => ({
  type,
  payload,
})

export const useSiteContext = () => useContext(ctx)

export const SiteContextConsumer = ctx.Consumer

export const SiteContextProvider: React.FC = ({ children }) => {
  const [siteContext, dispatch] = useReducer(
    SiteContextReducer,
    defaultSiteContext
  )
  return (
    <ctx.Provider value={{ ...siteContext, dispatch }}>{children}</ctx.Provider>
  )
}

export const withSiteContextProvider = (Component: any) => props => {
  const [siteContext, dispatch] = useReducer(
    SiteContextReducer,
    defaultSiteContext
  )
  return (
    <ctx.Provider value={{ ...siteContext, dispatch }}>
      <Component {...props} />
    </ctx.Provider>
  )
}
