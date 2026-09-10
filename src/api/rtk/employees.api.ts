import { baseApi } from './baseApi';
import { ENDPOINTS } from '../endpoints';
import { Employee, EmployeeApiParams } from '../../types/employee.type';

export const employeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], EmployeeApiParams>({
      query: (params) => ({ method: 'GET', url: ENDPOINTS.EMPLOYEES.LIST, params })
    }),
  }),
});

export const { useGetEmployeesQuery } = employeesApi;