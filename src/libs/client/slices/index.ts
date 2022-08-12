import { combineReducers } from 'redux'
import layout from './layout'
import stream from './stream'
import page from './page'

const rootReducer = combineReducers({
  layout,
  page,
  stream,
})

export default rootReducer
