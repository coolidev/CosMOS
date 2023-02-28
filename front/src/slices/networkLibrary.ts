import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';

interface NetworkDetailsLoader {
  selectedNetwork: number;
}

const initialState: NetworkDetailsLoader = {
  selectedNetwork: null
};

const slice = createSlice({
  name: 'networkLibrary',
  initialState,
  reducers: {
    updateNetworkDetailsLoader(
      state: NetworkDetailsLoader,
      action: PayloadAction<{ selectedNetwork: number; }>
    ) {
      const { selectedNetwork } = action.payload;
      state.selectedNetwork = selectedNetwork;
    }
  }
});

export const reducer = slice.reducer;

export const updateNetworkDetailsLoader =
  (selectedNetwork: number): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.updateNetworkDetailsLoader({ selectedNetwork: selectedNetwork }));
  };

export default slice;
