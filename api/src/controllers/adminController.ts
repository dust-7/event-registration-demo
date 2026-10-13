import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import employeeService from '../services/employeeService.js';
import eventService from '../services/eventService.js';
import registrationService from '../services/registrationService.js';
import onemapService from '../services/onemapService.js';
import { stripTime, dateToIsoString } from '../utils/date.js';

const createEventSchema = z.object({
  name: z.string('name is required and must be a string'),
  dateTime: z.iso.datetime('dateTime is required and must be a valid date string'),
  postalCode: z.string('postalCode is required and must be a string'),
  deadline: z.iso.date('deadline is required and must be a valid date string'),
  capacity: z.number('capacity is required and must be a positive integer').int().positive(),
  handlerUuid: z.uuid('handlerUuid is required and must be a valid UUID'),
});

const adminController = {
  async getEmployees(_req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await employeeService.listEmployees();
      
      res.json(employees);
    } catch (err) {
      next(err);
    }
  },

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const pageParam = req.query.page;

      if (pageParam === undefined || pageParam === '') {
        return res.status(421).json({ error: 'Missing required parameter: page' });
      }

      const page = Number(pageParam);
      if (isNaN(page) || page < 0 || !Number.isInteger(page)) {
        return res.status(421).json({ error: 'Parameter "page" must be an integer 0 or greater' });
      }

      const search = req.query.search as string | undefined;
      const open = ['true', '1'].includes(req.query.open as string);

      const { total, events } = await eventService.listAdminEvents(page, search, open);

      res.json({
        total,
        events: events.map((event) => ({
          uuid: event.uuid,
          createdAt: event.createdAt,
          name: event.name,
          dateTime: event.dateTime,
          address: event.address,
          deadline: event.deadline,
          capacity: event.capacity,
          registrationCount: event.registrationCount,
          handler: event.handler,
        })),
      });
    } catch (err) {
      next(err);
    }
  },

  async createEvent(req: Request<{}, {}, z.infer<typeof createEventSchema>>, res: Response, next: NextFunction) {
    try {
      const parsed = createEventSchema.safeParse(req.body);
      if (!parsed.success) {
        const messages = parsed.error.issues.map((e) => e.message);
        return res.status(421).json({ error: 'Validation error', details: messages });
      }

      const { name, dateTime, postalCode, deadline, capacity, handlerUuid } = parsed.data;

      // Validate dateTime is in the future
      const now = new Date();
      const dateTimeDate = new Date(dateTime);
      if (dateTimeDate <= now) {
        return res.status(421).json({ error: 'Validation error', details: [`dateTime must be in the future`] });
      }

      // Validate deadline date is >= today and <= dateTime date
      const today = stripTime(new Date());
      const deadlineDate = stripTime(new Date(deadline));
      const dateTimeDateOnly = stripTime(dateTimeDate);

      if (deadlineDate < today) {
        return res.status(421).json({ error: 'Validation error', details: [`deadline must be on or after today`] });
      }
      if (deadlineDate > dateTimeDateOnly) {
        return res.status(421).json({ error: 'Validation error', details: [`deadline must be on or before the event date`] });
      }

      // Validate handler exists
      const handler = await employeeService.getEmployeeByUuid(handlerUuid);
      if (!handler) {
        return res.status(421).json({ error: 'Validation error', details: [`Handler with uuid "${handlerUuid}" not found`] });
      }

      // Validate handler does not have another open event (events still open for registration)
      const openEvent = await eventService.getHandlerOpenEvent(handlerUuid, dateTimeDate);
      if (openEvent) {
        return res.status(421).json({ error: 'Validation error', details: [`Handler already handles an open event`] });
      }

      // Validate name is unique
      const existingEvent = await eventService.getEventByName(name);
      if (existingEvent) {
        return res.status(421).json({ error: 'Validation error', details: [`Event with name "${name}" already exists`] });
      }

      // Validate address is found
      const address = await onemapService.getAddress(postalCode);
      if (!address) {
        return res.status(421).json({ error: 'Validation error', details: [`No address found using postal code "${postalCode}"`] });
      }

      await eventService.createEvent(name, dateTime, address, deadline, capacity, handlerUuid);

      res.status(200).json(null);
    } catch (err) {
      next(err);
    }
  },

  async getEventRegistrationTrend(
    req: Request<{ uuid: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const event = await eventService.getEventByUuid(req.params.uuid);
      if (!event) {
        return res.status(421).json({ error: 'Event not found' });
      }

      const trend = await registrationService.getRegistrationTrend(req.params.uuid);
      res.json(trend);
    } catch (err) {
      next(err);
    }
  },
};

export default adminController;
