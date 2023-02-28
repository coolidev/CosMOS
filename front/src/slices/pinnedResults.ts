import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';

export interface ComparisonResult{
  name: string,
  id?: number,
  parameters: {
      altitude: number,
      inclination: number,
      eccentricity: number,
      frequencyBand: number,
      modulation: number,
      coding: number,
      standardsCompliance: number,
      latitude: number,
      longitude: number,
  },
  performance: {
    rfCoverage: number,
    meanContacts: number,
    meanContactDuration: number,
    averageGap: number,
    maxGap: number,
    meanResponseTime: number,
    effectiveCommsTime: number,
    dataRate: number,
    throughput: number
  },
  antennaOptions: {
    eirp: number,
    parabolicAntennaDiameter: number,
    parabolicAntennaMass: number,
    electronicAntennaSize: number,
    helicalAntennaHeight: number,
    patchAntennaSize: number,
    dipoleAntennaSize: number
  },
  navAndTracking: {
    trackingAccuracy: string,
    gnssAvailability: string
  }
}

interface pinnedResultsState {
  pinnedResults: ComparisonResult[],
  comparisonIds: string[]
}

const initialState: pinnedResultsState = {
  pinnedResults: [],
  comparisonIds: ["0"]
};

const slice = createSlice({
  name: 'pinnedResults',
  initialState,
  reducers: {
    updatePinnedResults(
      state: pinnedResultsState,
      action: PayloadAction<{ pinnedResults: ComparisonResult[] }>
    ) {
      const { pinnedResults } = action.payload;
      state.pinnedResults = pinnedResults;
    },
    updateComparisonIds(
      state: pinnedResultsState,
      action: PayloadAction<{ comparisonIds: string[] }>
    ) {
      const { comparisonIds } = action.payload;
      state.comparisonIds = comparisonIds;
    }
  }
});

export const reducer = slice.reducer;

export const updatePinnedResults =
(pinnedResults: ComparisonResult[]): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.updatePinnedResults({ pinnedResults: pinnedResults }));
  };

export const updateComparisonIds =
  (comparisonIds: string[]): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.updateComparisonIds({ comparisonIds: comparisonIds }));
  };
export default slice;
