import { AxiosRequestConfig } from 'axios';
import apiService from './AxiosClient';
import {ApiResponse } from '../types/types';

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  
    const response = await apiService.request(config);
    return response.data;
}