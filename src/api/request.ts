import { AxiosRequestConfig } from 'axios';
import apiService from './AxiosClient';
import {ApiResponse } from '../types/types';

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  
    const { data } = await apiService.request<ApiResponse<T>>(config);
    return data.response;
}