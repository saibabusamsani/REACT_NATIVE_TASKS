import { LoginPayload, LoginResponse } from '../../types/auth.type';
import apiService from '../AxiosClient';
import { ENDPOINTS } from '../Endpoints';

export const authService = {

  login: async (payload: LoginPayload,): Promise<LoginResponse> => {

    const response = await apiService.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      payload,
    );

    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiService.post(ENDPOINTS.AUTH.LOGOUT);
  }
};