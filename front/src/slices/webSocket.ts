import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'src/store';
import { SERVER_STATUS_URL } from 'src/utils/constants/paths';

interface WebSocketState {
    socket: WebSocket;
};

const initialState: WebSocketState = {
    socket: new WebSocket(SERVER_STATUS_URL)
};

let slice = createSlice({
    name: 'webSocket',
    initialState,
    reducers: {
        resetConnection(
            state: WebSocketState,
            action: PayloadAction<{ socket: WebSocket }>
          ) {
            const { socket } = action.payload;
            state.socket = socket;
          }
    }
});

export const resetConnection = (): AppThunk =>
    async (dispatch) => {
        dispatch(slice.actions.resetConnection({ socket: new WebSocket(SERVER_STATUS_URL) }));
    };

export const reducer = slice.reducer;

export default slice;