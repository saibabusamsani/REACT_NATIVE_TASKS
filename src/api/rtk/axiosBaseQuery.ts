import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig } from 'axios';

import { request } from '../request';
import {
  parseApiError,
  toReduxError,
  ReduxApiError,
} from '../ErrorHandler';

export const axiosBaseQuery = (): BaseQueryFn< AxiosRequestConfig, unknown,ReduxApiError> =>async (config) => {
    try {
      return {
        data: await request(config),
      };
    } catch (err) {
      const apiError = parseApiError(err);

      return {
        error: toReduxError(apiError),
      };
    }
  };