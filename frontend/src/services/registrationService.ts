import { client } from '../api/client';
import type { Result } from '../types/result';

interface RegisterPayload {
  eventUuid: string;
  emailAddress: string;
}

interface RegisterResponse {
  registrationNo: string;
}

interface RegisterError {
  error: string;
  details: string[];
}

export const registrationService = {
  register: async (payload: RegisterPayload): Promise<Result<RegisterResponse>> => {
    try {
      const { status, data } = await client.post('/public/register', payload);
      if (status === 200) {
        return { success: true, data: data as RegisterResponse };
      }
      if (status === 421 && data && typeof data === 'object') {
        return { success: false, error: (data as RegisterError).error, details: (data as RegisterError).details };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },
};
