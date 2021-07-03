import { combineReducers } from 'redux'
import layout from './layout'
import stream from './stream'

const rootReducer = combineReducers({
  layout,
  stream,
})

export default rootReducer
