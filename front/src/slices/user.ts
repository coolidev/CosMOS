import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import axios from 'src/utils/axios';

interface ResultsState {
    email: string;
    isAdmin: boolean;
    isEngineer: boolean;
};

const initialState: ResultsState = {
    email: '',
    isAdmin: false,
    isEngineer: false
};

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateEmail(
            state: ResultsState,
            action: PayloadAction<{ email: string }>
        ) {
            const { email } = action.payload;
            state.email = email;
        },
        updateUser(
            state: ResultsState,
            action: PayloadAction<{ isAdmin: boolean, isEngineer: boolean }>
        ) {
            const { isAdmin, isEngineer } = action.payload;
            state.isAdmin = isAdmin;
            state.isEngineer = isEngineer;
        }
    }
});

export const reducer = slice.reducer;

export const updateEmail = (email: string): AppThunk => 
    async (dispatch) => {
        dispatch(slice.actions.updateEmail({ email }));
    };

export const getUser = (): AppThunk =>
    async (dispatch) => {
        const params = { email: localStorage.getItem('email') };
        const response = await axios.post<{
            isAdmin: boolean, isEngineer: boolean
        }>('/getUserAccount', params);
        response.data && dispatch(slice.actions.updateUser(response.data));
    };

export default slice;