import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';
import type { Request } from 'express';
import publicController from './publicController.js';
import eventService from '../services/eventService.js';
import registrationService from '../services/registrationService.js';

const VALID_UUID = '550e8400-e29b-4142-a720-448900000000';
const mockEvent = { uuid: VALID_UUID, name: 'Workshop', dateTime: '2030-08-03T09:00:00.000Z', deadline: '2030-08-01T00:00:00.000Z', address: 'Room A' } as any;

describe('publicController', () => {
  let listPublicEventsSpy: jest.Spied<typeof eventService.listPublicEvents>;
  let getEventByUuidSpy: jest.Spied<typeof eventService.getEventByUuid>;
  let registerSpy: jest.Spied<typeof registrationService.register>;
  let res: any;

  beforeEach(() => {
    listPublicEventsSpy = jest.spyOn(eventService, 'listPublicEvents');
    listPublicEventsSpy.mockResolvedValue([mockEvent]);

    getEventByUuidSpy = jest.spyOn(eventService, 'getEventByUuid');
    getEventByUuidSpy.mockResolvedValue(mockEvent);

    registerSpy = jest.spyOn(registrationService, 'register');
    registerSpy.mockResolvedValue(42);

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getEvents', () => {
    test('returns open events with only public fields', async () => {
      await publicController.getEvents({} as Request, res, () => {});

      expect(listPublicEventsSpy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([mockEvent]);
    });
  });

  describe('register', () => {
    test('returns padded registration number for valid payload', async () => {
      const req = {
        body: { eventUuid: VALID_UUID, emailAddress: 'test@example.com' },
      } as Request;

      await publicController.register(req, res, () => {});

      expect(getEventByUuidSpy).toHaveBeenCalledWith(VALID_UUID);
      expect(registerSpy).toHaveBeenCalledWith(VALID_UUID, 'test@example.com');
      expect(res.json).toHaveBeenCalledWith({ registrationNo: '00042' });
    });
  });
});
