import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';

interface networkListState {
  coding: number[];
  frequencyBands: number[];
  modulation: number[];
  polarization: number[];
}

const initialState: networkListState = {
  coding: [],
  frequencyBands: [],
  modulation: [],
  polarization: []
};

const slice = createSlice({
  name: 'networkList',
  initialState,
  reducers: {
    updateNetworkList(
      state: networkListState,
      action: PayloadAction<{ coding: number[], frequencyBands: number[], modulation: number[], polarization: number[] }>
    ) {
      const { coding, frequencyBands, modulation, polarization } = action.payload;
      state.coding = coding;
      state.frequencyBands = frequencyBands;
      state.modulation = modulation;
      state.polarization = polarization;
    }
  }
});

export const reducer = slice.reducer;

export const updateNetworkList =
  (networkList: networkListState): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.updateNetworkList({ coding: networkList.coding, frequencyBands: networkList.frequencyBands, modulation: networkList.modulation, polarization: networkList.polarization }));
  };

export default slice;
