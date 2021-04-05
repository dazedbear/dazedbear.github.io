import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Viewport {
  height: number
  width: number
}

type Device = 'smartphone' | 'desktop'
interface LayoutState {
  isNavMenuViewable: boolean
  isTableOfContentViewable: boolean
  device: Device
  viewport: Viewport
}

const initialState = {
  isNavMenuViewable: false,
  isTableOfContentViewable: false,
  device: 'smartphone',
  viewport: {
    height: 0,
    width: 0,
  },
} as LayoutState

const LayoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    updateNavMenuViewability(
      state,
      action: PayloadAction<boolean | undefined>
    ) {
      const value =
        typeof action.payload !== 'undefined'
          ? action.payload
          : !state.isNavMenuViewable
      state.isNavMenuViewable = value
    },
    updateTableOfContentViewability(
      state,
      action: PayloadAction<boolean | undefined>
    ) {
      const value =
        typeof action.payload !== 'undefined'
          ? action.payload
          : !state.isTableOfContentViewable
      state.isTableOfContentViewable = value
    },
    updateViewport(state, action: PayloadAction<Viewport>) {
      state.viewport = action.payload
    },
    updateDevice(state, action: PayloadAction<Device>) {
      state.device = action.payload
    },
  },
})

export const {
  updateNavMenuViewability,
  updateTableOfContentViewability,
  updateViewport,
  updateDevice,
} = LayoutSlice.actions
export default LayoutSlice.reducer
