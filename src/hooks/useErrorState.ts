import { useState, useCallback } from 'react';
import { ApiError, parseApiError } from '../api/ErrorHandler';
import { ErrorStateType } from '../constants/errorStates';

export const useErrorState = () => {
  const [errorType, setErrorType] = useState<ErrorStateType | null>(null);

  const handleError = useCallback((err: unknown) => {
    const apiErr: ApiError = err instanceof ApiError ? err : parseApiError(err);
    const { status } = apiErr;

    if (status === null) setErrorType('offline');
    else if (status === 403) setErrorType('forbidden');
    else if (status === 404) setErrorType('notFound');
    else if (status >= 500) setErrorType('server');
    else setErrorType('generic');
  }, []);

  const clearError = useCallback(() => setErrorType(null), []);

  return { errorType, handleError, clearError };
};