
import { request } from '../request';
import { ENDPOINTS } from '../endpoints';
import { LoginPayload, LoginResponse } from '../../types/auth.type';

export const authService = {
  login: (payload: LoginPayload) =>
    request<LoginResponse>({ method: 'POST', url: ENDPOINTS.AUTH.LOGIN, data: payload }),

  logout: () =>
    request<void>({ method: 'POST', url: ENDPOINTS.AUTH.LOGOUT }),
};