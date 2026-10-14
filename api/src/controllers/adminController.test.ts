import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';
import type { Request } from 'express';
import adminController from './adminController.js';
import employeeService from '../services/employeeService.js';
import eventService from '../services/eventService.js';
import onemapService from '../services/onemapService.js';

const VALID_UUID = '550e8400-e29b-4142-a720-448900000000';
const mockEmployee = { uuid: VALID_UUID, name: 'Jane Tan' } as any;
const mockEvent = { uuid: VALID_UUID, createdAt: '2026-10-12T00:00:00.000Z', name: 'Workshop', dateTime: '2026-10-23T09:00:00.000Z', deadline: '2026-10-22T00:00:00.000Z', address: 'Room A', capacity: 50, registrationCount: 10, handler: { uuid: VALID_UUID, name: 'Jane Tan' } } as any;

describe('adminController', () => {
  let listEmployeesSpy: jest.Spied<typeof employeeService.listEmployees>;
  let listAdminEventsSpy: jest.Spied<typeof eventService.listAdminEvents>;
  let getEmployeeByUuidSpy: jest.Spied<typeof employeeService.getEmployeeByUuid>;
  let getHandlerOpenEventSpy: jest.Spied<typeof eventService.getHandlerOpenEvent>;
  let getEventByNameSpy: jest.Spied<typeof eventService.getEventByName>;
  let getAddressSpy: jest.Spied<typeof onemapService.getAddress>;
  let createEventSpy: jest.Spied<typeof eventService.createEvent>;
  let res: any;

  beforeEach(() => {
    listEmployeesSpy = jest.spyOn(employeeService, 'listEmployees');
    listEmployeesSpy.mockResolvedValue([mockEmployee]);

    listAdminEventsSpy = jest.spyOn(eventService, 'listAdminEvents');
    listAdminEventsSpy.mockResolvedValue({ total: 1, events: [mockEvent] });

    getEmployeeByUuidSpy = jest.spyOn(employeeService, 'getEmployeeByUuid');
    getEmployeeByUuidSpy.mockResolvedValue(mockEmployee);

    getHandlerOpenEventSpy = jest.spyOn(eventService, 'getHandlerOpenEvent');
    getHandlerOpenEventSpy.mockResolvedValue(null);

    getEventByNameSpy = jest.spyOn(eventService, 'getEventByName');
    getEventByNameSpy.mockResolvedValue(null);

    getAddressSpy = jest.spyOn(onemapService, 'getAddress');
    getAddressSpy.mockResolvedValue('123 Main St');

    createEventSpy = jest.spyOn(eventService, 'createEvent');
    createEventSpy.mockResolvedValue(undefined);

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getEmployees', () => {
    test('returns list of employees successfully', async () => {
      await adminController.getEmployees({} as unknown as Request, res, () => {});

      expect(listEmployeesSpy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([mockEmployee]);
    });
  });

  describe('getEvents', () => {
    test('returns paginated events with search/open filters', async () => {
      const req = {
        query: { page: '1', search: 'tech', open: 'true' },
      } as unknown as Request;

      await adminController.getEvents(req, res, () => {});

      expect(listAdminEventsSpy).toHaveBeenCalledWith(1, 'tech', true);
      expect(res.json).toHaveBeenCalledWith({
        total: 1,
        events: [
          {
            uuid: mockEvent.uuid,
            createdAt: mockEvent.createdAt,
            name: mockEvent.name,
            dateTime: mockEvent.dateTime,
            address: mockEvent.address,
            deadline: mockEvent.deadline,
            capacity: mockEvent.capacity,
            registrationCount: mockEvent.registrationCount,
            handler: mockEvent.handler,
          },
        ],
      });
    });

    test('returns 421 when page is missing or invalid', async () => {
      await adminController.getEvents({ query: {} } as unknown as Request, res, () => {});
      expect(res.status).toHaveBeenCalledWith(421);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required parameter: page' });

      res.json.mockClear();
      await adminController.getEvents({ query: { page: 'abc' } } as unknown as Request, res, () => {});
      expect(res.status).toHaveBeenCalledWith(421);
      expect(res.json).toHaveBeenCalledWith({ error: 'Parameter "page" must be an integer 0 or greater' });

      res.json.mockClear();
      await adminController.getEvents({ query: { page: '-1' } } as unknown as Request, res, () => {});
      expect(res.status).toHaveBeenCalledWith(421);
      expect(res.json).toHaveBeenCalledWith({ error: 'Parameter "page" must be an integer 0 or greater' });
    });
  });

  describe('createEvent', () => {
    test('creates event successfully with valid body', async () => {
      const req = {
        body: {
          name: 'Tech Workshop',
          dateTime: '2026-10-23T09:00:00.000Z',
          postalCode: '1234567',
          deadline: '2026-10-22',
          capacity: 50,
          handlerUuid: VALID_UUID,
        },
      } as unknown as Request;

      await adminController.createEvent(req, res, () => {});

      expect(getEmployeeByUuidSpy).toHaveBeenCalledWith(VALID_UUID);
      expect(getHandlerOpenEventSpy).toHaveBeenCalledWith(VALID_UUID, expect.any(Date));
      expect(getEventByNameSpy).toHaveBeenCalledWith('Tech Workshop');
      expect(getAddressSpy).toHaveBeenCalledWith('1234567');
      expect(createEventSpy).toHaveBeenCalledWith('Tech Workshop', '2026-10-23T09:00:00.000Z', '123 Main St', '2026-10-22', 50, VALID_UUID);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('returns 421 with validation errors', async () => {
      const req = {
        body: {
          name: 'Tech Workshop',
          dateTime: '2026-10-23T09:00:00.000Z',
          postalCode: '1234567',
          deadline: '2026-10-22',
          capacity: 50,
          handlerUuid: VALID_UUID,
        },
      } as unknown as Request;

      getEmployeeByUuidSpy.mockResolvedValue(null);

      await adminController.createEvent(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(421);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: [`Handler with uuid "${VALID_UUID}" not found`],
      });
    });
  });
});
