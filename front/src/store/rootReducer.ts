import { combineReducers } from '@reduxjs/toolkit';
import { reducer as pinnedResultsReducer } from 'src/slices/pinnedResults';
import { reducer as projectReducer } from 'src/slices/project';
import { reducer as preferenceReducer } from 'src/slices/preference';
import { reducer as resultsReducer } from 'src/slices/results';
import { reducer as userReducer } from 'src/slices/user';
import { reducer as webSocketReducer } from 'src/slices/webSocket';
import { reducer as zoomReducer } from 'src/slices/zoom';
import { reducer as networkListReducer } from 'src/slices/networkList';
import { reducer as networkLibraryReducer } from 'src/slices/networkLibrary';

const rootReducer = combineReducers({
  preference: preferenceReducer,
  project: projectReducer,
  results: resultsReducer,
  user: userReducer,
  webSocket: webSocketReducer,
  zoom: zoomReducer,
  pinnedResults: pinnedResultsReducer,
  networkLibrary: networkLibraryReducer,
  networkList: networkListReducer
});

export default rootReducer;
