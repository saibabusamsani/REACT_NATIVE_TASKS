import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  user: Record<string, any> | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setAuthLoading } = authSlice.actions;
export const {reducer : authReducer} = authSlice;