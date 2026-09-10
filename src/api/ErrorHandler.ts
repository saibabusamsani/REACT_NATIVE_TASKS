import axios, { AxiosError } from 'axios';

import { ErrorStateType } from '../constants/errorStates';

export type ReduxApiError = {
  status: number | null;
  message: string;
};

export class ApiError extends Error {
  constructor(public status: number | null, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const isCancelledRequest = (error: unknown): boolean => axios.isCancel(error);

export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  const axiosError = error as AxiosError<{ message?: string }>;

  if (axiosError?.response) {
    return new ApiError(
      axiosError.response.status,
      axiosError.response.data?.message ||
      'Something went wrong. Please try again.',
    );
  }

  if (axiosError?.request) {
    return new ApiError(
      null,
      'Network error. Please check your connection.',
    );
  }

  return new ApiError(
    null,
    error instanceof Error
      ? error.message
      : 'Unexpected error occurred.',
  );
};

export const toReduxError = (error: ApiError): ReduxApiError => ({
  status: error.status,
  message: error.message,
});

export const mapErrorToType = (apiError: ReduxApiError): ErrorStateType => {

  const { status } = apiError;

  if (status === null) return 'offline';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'notFound';
  if (status >= 500) return 'server';

  return 'generic';
};

export const getErrorType = (error: unknown): ErrorStateType => {

  const apiError = (error as { data?: ReduxApiError })?.data;

  return apiError ? mapErrorToType(apiError) : 'generic';
};