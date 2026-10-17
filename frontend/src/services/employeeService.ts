import { client } from '../api/client';
import type { Result } from '../types/result';

export interface Employee {
  uuid: string;
  name: string;
}

export const employeeService = {
  listEmployees: async (): Promise<Result<Employee[]>> => {
    try {
      const { data } = await client.get('/admin/employees');
      return { success: true, data };
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const responseData = (error as any).response?.data;
        if (responseData && typeof responseData === 'object') {
          return { success: false, error: (responseData as any).error, details: (responseData as any).details };
        }
      }
      return { success: false };
    }
  },
};
