import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';
import { Op, col } from 'sequelize';
import { Employee, Event } from '../models/index.js';
import eventService from './eventService.js';

const mockEvent = { uuid: 'evt-1', name: 'Workshop', dateTime: '2025-07-01T09:00:00.000Z', deadline: '2025-08-01T00:00:00.000Z', address: 'Room A', capacity: 50, handlerUuid: 'emp-1' } as any;

describe('eventService', () => {
  let findAllSpy: jest.Spied<typeof Event.findAll>;
  let countSpy: jest.Spied<typeof Event.count>;
  let findByPkSpy: jest.Spied<typeof Event.findByPk>;
  let createSpy: jest.Spied<typeof Event.create>;

  beforeEach(() => {
    findAllSpy = jest.spyOn(Event, 'findAll');
    countSpy = jest.spyOn(Event, 'count');
    findByPkSpy = jest.spyOn(Event, 'findByPk');
    createSpy = jest.spyOn(Event, 'create');

    findAllSpy.mockResolvedValue([mockEvent]);
    countSpy.mockResolvedValue(1);
    findByPkSpy.mockResolvedValue(mockEvent);
    createSpy.mockResolvedValue(mockEvent);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('listPublicEvents', () => {
    test('returns future events ordered by dateTime ascending', async () => {
      const result = await eventService.listPublicEvents();

      expect(findAllSpy).toHaveBeenCalledWith({
        where: {
          [Op.and]: [
            { deadline: { [Op.gte]: expect.any(String) } },
            { registrationCount: { [Op.lt]: col('capacity') } },
          ],
        },
        order: [['dateTime', 'ASC']],
      });
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('listAdminEvents', () => {
    test('returns paginated results with correct total count', async () => {
      const result = await eventService.listAdminEvents(0);

      expect(countSpy).toHaveBeenCalledWith({
        where: {},
        include: [{ model: Employee, as: 'handler' }],
      });
      expect(findAllSpy).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['dateTime', 'ASC']],
        include: [{ model: Employee, as: 'handler', attributes: ['uuid', 'name'] }],
      });
      expect(result).toEqual({ total: 1, events: [mockEvent] });
    });

    test('returns events matching search query', async () => {
      await eventService.listAdminEvents(1, 'Workshop');

      expect(findAllSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            [Op.or]: [
              { name: { [Op.like]: '%Workshop%' } },
              { address: { [Op.like]: '%Workshop%' } },
              { '$handler.name$': { [Op.like]: '%Workshop%' } },
            ],
          }),
        })
      );
    });
  });

  describe('getEventByUuid', () => {
    test('returns the event for a valid UUID', async () => {
      const result = await eventService.getEventByUuid('evt-1');

      expect(findByPkSpy).toHaveBeenCalledWith('evt-1');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('createEvent', () => {
    test('creates and persists an event with correct data', async () => {
      await eventService.createEvent(
        'Workshop',
        '2025-07-01T09:00:00.000Z',
        'Room A',
        '2025-08-01T00:00:00.000Z',
        50,
        'emp-1'
      );

      expect(createSpy).toHaveBeenCalledWith({
        name: 'Workshop',
        dateTime: new Date('2025-07-01T09:00:00.000Z'),
        address: 'Room A',
        deadline: new Date('2025-08-01T00:00:00.000Z'),
        capacity: 50,
        handlerUuid: 'emp-1',
      });
    });
  });
});
