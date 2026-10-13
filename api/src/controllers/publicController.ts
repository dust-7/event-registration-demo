import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { stripTime } from '../utils/date.js';
import eventService from '../services/eventService.js';
import registrationService from '../services/registrationService.js';

const registerSchema = z.object({
  eventUuid: z.uuid('eventUuid is required and must be a valid UUID'),
  emailAddress: z.email('emailAddress is required and must be a valid email'),
});

const publicController = {
  async getEvents(_req: Request, res: Response, next: NextFunction) {
    try {
      const events = await eventService.listPublicEvents();

      res.json(
        events.map((event) => ({
          uuid: event.uuid,
          name: event.name,
          dateTime: event.dateTime,
          address: event.address,
          deadline: event.deadline,
        }))
      );
    } catch (err) {
      next(err);
    }
  },

  async register(req: Request<{}, {}, z.infer<typeof registerSchema>>, res: Response, next: NextFunction) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const messages = parsed.error.issues.map((e) => e.message);
        return res.status(421).json({ error: 'Validation error', details: messages });
      }

      const { eventUuid, emailAddress } = parsed.data;

      // Validate event exists
      const event = await eventService.getEventByUuid(eventUuid);
      if (!event) {
        return res.status(421).json({ error: 'Validation error', details: [`Event with uuid "${eventUuid}" not found`] });
      }

      // Validate event is still open
      if (stripTime(new Date(event.deadline)) < stripTime(new Date())) {
        return res.status(421).json({ error: 'Validation error', details: [`Event registration has closed`] });
      }

      // Validate event has capacity
      if (event.registrationCount >= event.capacity) {
        return res.status(421).json({ error: 'Validation error', details: [`Event is at full capacity`] });
      }

      const registrationNo = await registrationService.register(eventUuid, emailAddress);

      res.status(200).json({ registrationNo: String(registrationNo).padStart(5, '0') });
    } catch (err) {
      next(err);
    }
  },
};

export default publicController;
