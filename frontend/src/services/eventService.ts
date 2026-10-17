import { client } from '../api/client';
import type { Result } from '../types/result';
import { formatDateTime, formatDate, formatAdminDate, formatAdminDateTime } from '../utils/date';

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

interface AdminEvent {
  uuid: string;
  createdAt: string;
  name: string;
  dateTime: string;
  address: string;
  deadline: string;
  capacity: number;
  registrationCount: number;
  handler: { uuid: string; name: string };
}

export interface AdminEventDto {
  uuid: string;
  createdAt: string;
  name: string;
  dateTime: string;
  address: string;
  deadline: string;
  capacity: number;
  registrationCount: number;
  handler: { uuid: string; name: string };
}

interface CreateEventInput {
  name: string;
  dateTime: string;
  postalCode: string;
  deadline: string;
  capacity: number;
  handlerUuid: string;
}

interface ListAdminEventsResponse {
  total: number;
  events: AdminEventDto[];
}

export const eventService = {
  listPublicEvents: async (): Promise<Result<PublicEventDto[]>> => {
    try {
      const { data } = await client.get('/public/events');
      const formatted = (data as PublicEvent[]).map((evt) => ({
        ...evt,
        dateTime: formatDateTime(evt.dateTime),
        deadline: formatDate(evt.deadline),
      }));
      return { success: true, data: formatted };
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

  listAdminEvents: async (params: {
    page: number;
    search?: string;
    open?: boolean;
  }): Promise<Result<ListAdminEventsResponse>> => {
    try {
      const query = new URLSearchParams();
      query.set('page', String(params.page));
      if (params.search) query.set('search', params.search);
      if (params.open) query.set('open', 'true');

      const { data } = await client.get(`/admin/events?${query.toString()}`);
      const rawData = data as { total: number; events: AdminEvent[] };
      const formatted = rawData.events.map((evt) => ({
        ...evt,
        createdAt: formatAdminDate(evt.createdAt),
        dateTime: formatAdminDateTime(evt.dateTime),
        deadline: formatAdminDate(evt.deadline),
      }));
      return { success: true, data: { total: rawData.total, events: formatted } };
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

  createEvent: async (input: CreateEventInput): Promise<Result<void>> => {
    try {
      await client.post('/admin/events', input);
      return { success: true };
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
