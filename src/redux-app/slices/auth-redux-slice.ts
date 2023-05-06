import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/redux-store';

interface AuthState {
  authStatus: boolean;
  authUsername: string | null;
  authPassword: string | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  authStatus: false,
  authUsername: null,
  authPassword: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.authStatus = action.payload;
    },
    setAuthUsername: (state, action: PayloadAction<string | null>) => {
      state.authUsername = action.payload;
    },
    setAuthPassword: (state, action: PayloadAction<string | null>) => {
      state.authPassword = action.payload;
    },
  },
});

export const { setAuthStatus, setAuthUsername, setAuthPassword } =
  authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
