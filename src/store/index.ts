import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './Authslice';
import { baseApi } from '../api/rtk/baseApi';


export const store = configureStore({
  reducer: {
    authentication: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,   // 'api': baseApi.reducer
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;