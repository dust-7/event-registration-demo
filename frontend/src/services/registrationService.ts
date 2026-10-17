import { client } from '../api/client';
import type { Result } from '../types/result';

interface RegisterPayload {
  eventUuid: string;
  emailAddress: string;
}

interface RegisterResponse {
  registrationNo: string;
}

export interface RegistrationTrendEntry {
  date: string;
  registrationCount: number;
  newRegistrationCount: number;
}

export const registrationService = {
  register: async (payload: RegisterPayload): Promise<Result<RegisterResponse>> => {
    try {
      const { data } = await client.post('/public/register', payload);
      return { success: true, data: data as RegisterResponse };
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

  getRegistrationTrend: async (eventUuid: string): Promise<Result<RegistrationTrendEntry[]>> => {
    try {
      const { data } = await client.post(`/admin/events/${eventUuid}/trend`, {});
      return { success: true, data: data as RegistrationTrendEntry[] };
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
