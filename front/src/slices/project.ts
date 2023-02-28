import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';

interface ProjectState {
  project: string | null;
}

const initialState: ProjectState = {
  project: null
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    getProject(
      state: ProjectState,
      action: PayloadAction<{ project: string }>
    ) {
      const { project } = action.payload;
      state.project = project;
    },
    updateProject(
      state: ProjectState,
      action: PayloadAction<{ project: string }>
    ) {
      const { project } = action.payload;
      state.project = project;
    }
  }
});

export const reducer = slice.reducer;

export const getProject = (): AppThunk => async (dispatch) => {
  const project = String(localStorage.getItem('project')) || null;
  dispatch(slice.actions.getProject({ project }));
};

export const updateProject =
  (project: string): AppThunk =>
  async (dispatch) => {
    localStorage.setItem('project', project ? project.toString() : null);
    dispatch(slice.actions.updateProject({ project }));
  };

export default slice;
