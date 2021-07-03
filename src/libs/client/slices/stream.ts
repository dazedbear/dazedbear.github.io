import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import merge from 'lodash/merge'
import { notion } from '../../../../site.config'

interface ContentState {
  content?: object
  ids?: string[]
  index?: number
  total?: number
}

interface ActionPayloadState {
  name: string
  data: ContentState
}

interface StreamState {
  [propName: string]: ContentState
}

type getInitialStateFn = () => StreamState

// generate initState from site.config.js notion.pages
const getInitialState: getInitialStateFn = () => {
  const defaultContentState = {
    content: {},
    ids: [],
    index: 0,
    total: 0,
  }
  return Object.keys(notion.pages).reduce((initState, name) => {
    const pageConfig = notion.pages[name]
    if (pageConfig.enabled) {
      initState[name] = Object.assign({}, defaultContentState)
    }
    return initState
  }, {})
}

const StreamSlice = createSlice({
  name: 'stream',
  initialState: getInitialState(),
  reducers: {
    updateStream(state, action: PayloadAction<ActionPayloadState>) {
      const { name, data } = action.payload
      state[name] = data
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => merge(state, action.payload.stream),
  },
})

export const { updateStream } = StreamSlice.actions

export default StreamSlice.reducer
