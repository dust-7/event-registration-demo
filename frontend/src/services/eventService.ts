import { client } from '../api/client';
import type { Result } from '../types/result';
import { formatDateTime, formatDate } from '../utils/date';

interface PublicEvent {
  uuid: string;
  name: string;
  dateTime: string;
  address: string;
  deadline: string;
}

export interface PublicEventDto {
  uuid: string;
  name: string;
  dateTime: string;
  address: string;
  deadline: string;
}

export const eventService = {
  listPublicEvents: async (): Promise<Result<PublicEventDto[]>> => {
    try {
      const { status, data } = await client.get('/public/events');
      if (status === 200) {
        const formatted = (data as PublicEvent[]).map((evt) => ({
          ...evt,
          dateTime: formatDateTime(evt.dateTime),
          deadline: formatDate(evt.deadline),
        }));
        return { success: true, data: formatted };
      }
      if (data && typeof data === 'object') {
        return { success: false, error: (data as any).error, details: (data as any).details };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },
};
