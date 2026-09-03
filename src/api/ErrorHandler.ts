import axios, { AxiosError } from 'axios';

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
      axiosError.response.data?.message || 'Something went wrong. Please try again.',
    );
  }

  if (axiosError?.request) {
    return new ApiError(null, 'Network error. Please check your connection.');
  }

  return new ApiError(
    null,
    axiosError instanceof Error ? axiosError.message : 'Unexpected error occurred.',
  );
};