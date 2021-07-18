import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import isEmpty from 'lodash/isEmpty'
import { notion } from '../../../../site.config'

interface ContentState {
  content?: object
  error?: any
  hasNext?: boolean
  ids?: string[]
  index?: number
  isLoading?: boolean
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
    error: null,
    hasNext: false,
    ids: [],
    index: 0,
    isLoading: false,
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

/**
 * Async Thunks
 */
export const fetchStreamPosts = createAsyncThunk(
  'stream/fetchStreamPosts',
  async (
    param: { index: number; count: number; pageName: string },
    thunkAPI
  ) => {
    const response = await fetch(
      `/api/posts?index=${param.index}&count=${param.count}&pageName=${param.pageName}`
    )
    if (!response.ok) {
      const { status, statusText } = response
      return thunkAPI.rejectWithValue({ status, statusText })
    }
    const data = await response.json()
    return data
  },
  {
    condition: (param, { getState }) => {
      const state = getState()
      if (get(state, ['stream', param.pageName, 'isLoading'])) {
        return false
      }
      return true
    },
  }
)

/**
 * Slices
 */
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
    [HYDRATE]: (state, action) => {
      const retainState = Object.keys(state).reduce((composite, name) => {
        const currentState = get(state, [name])
        if (!isEmpty(currentState.content)) {
          composite[name] = cloneDeep(currentState)
        }
        return composite
      }, {})
      merge(state, action.payload.stream, retainState)
    },
    [fetchStreamPosts.fulfilled as any]: (state, action) => {
      const name = get(action, ['meta', 'arg', 'pageName'])
      const ids = get(action, ['payload', 'result', 'blockIds'])
      const total = get(action, ['payload', 'result', 'total'])
      const index = get(action, ['payload', 'result', 'index'])
      const hasNext = get(action, ['payload', 'result', 'hasNext'])
      const content = get(action, ['payload', 'recordMap'])

      state[name] = {
        content: merge(state[name].content, content),
        error: null,
        hasNext,
        ids,
        index,
        isLoading: false,
        total,
      }
    },
    [fetchStreamPosts.pending as any]: (state, action) => {
      const name = get(action, ['meta', 'arg', 'pageName'])
      state[name].isLoading = true
    },
    [fetchStreamPosts.rejected as any]: (state, action) => {
      const name = get(action, ['meta', 'arg', 'pageName'])
      state[name].error = action.error
      state[name].isLoading = false
    },
  },
})

export const { updateStream } = StreamSlice.actions

export default StreamSlice.reducer
