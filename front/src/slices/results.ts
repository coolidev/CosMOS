import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import type { 
    PerformancePanel,
    ModCodOption
} from 'src/types/evaluation';
import type { AnalyticsPanel } from 'src/types/dashboard';
import type { LinkBudgetRow } from 'src/types/link-budget';
import type { ICompare } from 'src/types/comparison';

export interface ResultsState {
    performancePanel: PerformancePanel;
    analyticsPanel: AnalyticsPanel;
    linkBudget: { [key: string]: LinkBudgetRow[] };
    comparePanel: ICompare;
    analyticsView: string;
    modCodOptions: { [key: string]: ModCodOption[] };
    frequencyBandOptions: { [key: string]: { id: number, name: string }[] };
    antennaOptions: { [key: string]: { id: number, name: string }[] };
};

const initialState: ResultsState = {
    performancePanel: null,
    analyticsPanel: null,
    linkBudget: {},
    comparePanel: null,
    modCodOptions: {},
    frequencyBandOptions: {},
    antennaOptions: {},
    analyticsView: 'coverage'
};

const slice = createSlice({
    name: 'results',
    initialState,
    reducers: {
        updateResults(
            state: ResultsState
        ) {
            state.performancePanel = null;
            state.analyticsPanel = null;
            state.linkBudget = {};
            state.comparePanel = null;
            //state.modCodOptions = {};
            //state.frequencyBandOptions = {};
            //state.antennaOptions = {};
        },
        updatePerformancePanel(
            state: ResultsState,
            action: PayloadAction<{ performancePanel: PerformancePanel }>
        ) {
            const { performancePanel } = action.payload;
            state.performancePanel = performancePanel;
        },
        updateAnalyticsPanel(
            state: ResultsState,
            action: PayloadAction<{ analyticsPanel: AnalyticsPanel }>
        ) {
            const { analyticsPanel } = action.payload;
            state.analyticsPanel = analyticsPanel;
        },
        updateLinkBudget(
            state: ResultsState,
            action: PayloadAction<{ id: string, linkBudget: LinkBudgetRow[] }>
        ) {
            const { id, linkBudget } = action.payload;
            state.linkBudget[id] = linkBudget;
        },
        updateComparePanel(
            state: ResultsState,
            action: PayloadAction<{ comparePanel: ICompare }>
        ) {
            const { comparePanel } = action.payload;
            state.comparePanel = comparePanel;
        },
        updateAnalyticsView(
            state: ResultsState,
            action: PayloadAction<{ analyticsView: string }>
        ) {
            const { analyticsView } = action.payload;
            state.analyticsView = analyticsView;
        },
        updateModCodOptions(
            state: ResultsState,
            action: PayloadAction<{ id: number, modCodOptions: ModCodOption[] }>
        ) {
            const { id, modCodOptions } = action.payload;
            state.modCodOptions[id] = modCodOptions;
        },
        updateFrequencyBandOptions(
            state: ResultsState,
            action: PayloadAction<{ id: number, frequencyBandOptions: { id: number, name: string }[] }>
        ) {
            const { id, frequencyBandOptions } = action.payload;
            state.frequencyBandOptions[id] = frequencyBandOptions;
        },
        updateAntennaOptions(
            state: ResultsState,
            action: PayloadAction<{ id: number, antennaOptions: { id: number, name: string }[] }>
        ) {
            const { id, antennaOptions } = action.payload;
            state.antennaOptions[id] = antennaOptions;
        }
    }
});

export const reducer = slice.reducer;

export const updateResults = (): AppThunk => 
    async (dispatch) => {
        dispatch(slice.actions.updateResults());
    };

export const updatePerformancePanel = (performancePanel: PerformancePanel): AppThunk =>
    async (dispatch) => {
        dispatch(slice.actions.updatePerformancePanel({ performancePanel }));
    };

export const updateAnalyticsPanel = (analyticsPanel: AnalyticsPanel): AppThunk =>
    async (dispatch) => {
        dispatch(slice.actions.updateAnalyticsPanel({ analyticsPanel }));
    };

export const updateLinkBudget = (id: string, linkBudget: LinkBudgetRow[]): AppThunk =>
    async (dispatch) => {
        dispatch(slice.actions.updateLinkBudget({ id, linkBudget }));
    };

export const updateComparePanel = (comparePanel: ICompare): AppThunk =>
    async (dispatch) => {
        dispatch(slice.actions.updateComparePanel({ comparePanel }));
    };

export const updateAnalyticsView = (analyticsView: string): AppThunk =>
    async (dispatch) => {
        dispatch(slice.actions.updateAnalyticsView({ analyticsView }));
    };

export const updateModCodOptions = (id: number, modCodOptions: ModCodOption[]): AppThunk => 
    async (dispatch) => {
        dispatch(slice.actions.updateModCodOptions({ id, modCodOptions }));
    };

export const updateFrequencyBandOptions = (id: number, frequencyBandOptions: { id: number, name: string }[]): AppThunk => 
    async (dispatch) => {
        dispatch(slice.actions.updateFrequencyBandOptions({ id, frequencyBandOptions }));
    };

export const updateAntennaOptions = (id: number, antennaOptions: { id: number, name: string }[]): AppThunk => 
    async (dispatch) => {
        dispatch(slice.actions.updateAntennaOptions({ id, antennaOptions }));
    };

export default slice;