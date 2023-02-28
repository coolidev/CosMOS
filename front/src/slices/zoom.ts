import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';

interface zoomState {
  zoom: number;
}

const initialState: zoomState = {
  zoom: 1
};

const slice = createSlice({
  name: 'zoom',
  initialState,
  reducers: {
    updateZoom(
      state: zoomState,
      action: PayloadAction<{ zoom: number }>
    ) {
      const { zoom } = action.payload;
      state.zoom = zoom;
    }
  }
});

export const reducer = slice.reducer;

export const updateZoom =
  (): AppThunk =>
  async (dispatch) => {
    const isFullScreen = (window.screen.availHeight || window.screen.height - 30) <= window.innerHeight;
    const zoom = (window.outerWidth / window.innerWidth + (isFullScreen ? 0.01 : 0));
    dispatch(slice.actions.updateZoom({ zoom: zoom }));
  };

export default slice;
