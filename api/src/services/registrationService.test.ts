import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';
import { Registrant } from '../models/index.js';
import registrationService from './registrationService.js';
import eventService from './eventService.js';

const mockRegistrant = { registrationNo: 42, eventUuid: 'evt-123', emailAddress: 'a@b.com' } as any;

describe('registrationService', () => {
  let createSpy: jest.Spied<typeof Registrant.create>;
  let getEventByUuidSpy: jest.Spied<typeof eventService.getEventByUuid>;
  let findAllSpy: jest.Spied<typeof Registrant.findAll>;

  beforeEach(() => {
    createSpy = jest.spyOn(Registrant, 'create');
    getEventByUuidSpy = jest.spyOn(eventService, 'getEventByUuid');
    findAllSpy = jest.spyOn(Registrant, 'findAll');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    test('creates a registrant and returns registrationNo', async () => {
      createSpy.mockResolvedValue(mockRegistrant);

      const result = await registrationService.register('evt-123', 'a@b.com');

      expect(createSpy).toHaveBeenCalledWith({
        eventUuid: 'evt-123',
        emailAddress: 'a@b.com',
      });
      expect(result).toBe(42);
    });

    test('throws when the event does not exist', async () => {
      const error = new Error('violates foreign key constraint');
      (error as any).name = 'SequelizeForeignKeyConstraintError';
      createSpy.mockRejectedValue(error);

      await expect(registrationService.register('nonexistent', 'a@b.com')).rejects.toThrow(
        'violates foreign key constraint'
      );
      expect(createSpy).toHaveBeenCalledWith({
        eventUuid: 'nonexistent',
        emailAddress: 'a@b.com',
      });
    });
  });

  describe('getRegistrationTrend', () => {
    test('returns cumulative and daily registration counts per day', async () => {
      const eventCreatedAt = new Date('2025-01-01');
      const eventDeadline = new Date('2025-01-04');

      getEventByUuidSpy.mockResolvedValue({
        createdAt: eventCreatedAt,
        deadline: eventDeadline,
      } as any);

      findAllSpy.mockResolvedValue([
        { date: '2025-01-01', count: '2' },
        { date: '2025-01-03', count: '3' },
      ] as any);

      const result = await registrationService.getRegistrationTrend('evt-123');

      expect(result).toEqual([
        { date: '2025-01-01', registrationCount: 2, newRegistrationCount: 2 },
        { date: '2025-01-02', registrationCount: 2, newRegistrationCount: 0 },
        { date: '2025-01-03', registrationCount: 5, newRegistrationCount: 3 },
        { date: '2025-01-04', registrationCount: 5, newRegistrationCount: 0 },
      ]);
    });
  });
});
