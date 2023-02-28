import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import axios from 'src/utils/axios';
import type { Preference } from 'src/types/preference';

interface PreferenceState {
  preference: Preference;
}

const initialPreference: Preference = {
  project: []
};

const initialState: PreferenceState = {
  preference: initialPreference
};

const slice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    getPreference(
      state: PreferenceState,
      action: PayloadAction<{ preference: Preference }>
    ) {
      const { preference } = action.payload;
      state.preference = preference;
    },
    updatePreference(
      state: PreferenceState,
      action: PayloadAction<{ preference: Preference }>
    ) {
      const { preference } = action.payload;
      state.preference = preference;
    }
  }
});

export const reducer = slice.reducer;

export const getPreference = (): AppThunk => async (dispatch) => {
  const params = { email: localStorage.getItem('email') };
  const response = await axios.post<{
    preference: any;
  }>('/requestUserPreferences', params);
  response.data && dispatch(slice.actions.getPreference(response.data));
};

export const updatePreference =
  (preference: Preference): AppThunk =>
  async (dispatch) => {
    const params = {
      email: localStorage.getItem('email'),
      preference: preference
    };
    const response = await axios.post<{
      preference: any;
    }>('/updateUserPreferences', params);
    if (response.data) {
      dispatch(slice.actions.updatePreference({preference: response.data.preference}));
    }
  };

export default slice;
