import { baseApi } from './baseApi';
import { ENDPOINTS } from '../endpoints';
import { LoginPayload, User } from '../../types/auth.type';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginEmployee: builder.mutation<User, LoginPayload>({
      query: (payload) => ({
        method: 'POST',
        url: ENDPOINTS.AUTH.LOGIN,
        data: payload,
      }),
    }),
  }),
});

export const { useLoginEmployeeMutation } = authApi;