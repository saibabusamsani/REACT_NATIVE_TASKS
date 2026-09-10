import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/auth.type';

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
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