import { request } from '../request';
import { ENDPOINTS } from '../endpoints';
import { Employee, EmployeeApiParams } from '../../types/employee.type';

export const employeeService = {
  list: (params: EmployeeApiParams,signal? : AbortSignal) =>  request<Employee[]>({ method: 'GET', url: ENDPOINTS.EMPLOYEES.LIST, params,signal }),
};