import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import isEmpty from 'lodash/isEmpty'
import { notion } from '../../../../site.config'

const slideName = 'page';

interface ContentState {}

export interface ActionPayloadState {
  name: string
  data: ContentState
}

interface PageState {
  [propName: string]: ContentState
}

type getInitialStateFn = () => PageState

// generate initState from site.config.js notion.pages
const getInitialState: getInitialStateFn = () => {
  return Object.keys(notion.pages).reduce((initState, name) => {
    const pageConfig = notion.pages[name]
    if (pageConfig.enabled && pageConfig.type === slideName) {
      initState[name] = {}
    }
    return initState
  }, {})
}

/**
 * Slices
 */
const PageSlice = createSlice({
  name: slideName,
  initialState: getInitialState(),
  reducers: {
    updateSinglePage(state, action: PayloadAction<ActionPayloadState>) {
      const { name, data } = action.payload
      state[name] = data
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      const retainState = Object.keys(state).reduce((composite, name) => {
        const currentState = get(state, [name])
        if (!isEmpty(currentState)) {
          composite[name] = cloneDeep(currentState)
        }
        return composite
      }, {})
      merge(state, action.payload[slideName], retainState)
    },
  },
})

export const { updateSinglePage } = PageSlice.actions

export default PageSlice.reducer
