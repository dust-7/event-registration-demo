import { logger } from '../utils/logger.js';
import Employee from '../models/Employee.js';
import Event from '../models/Event.js';
import Registrant from '../models/Registrant.js';

const SEED_EMPLOYEES = ['Alice', 'Bob', 'Charlie'];

const SEED_EVENTS = [
  {
    name: 'Tech Conference 2025',
    date_time: new Date('2026-10-30T15:30:00'),
    address: '123 Convention Blvd, San Francisco, CA',
    deadline: new Date('2026-10-29'),
    capacity: 200,
  },
  {
    name: 'Product Launch Gala',
    date_time: new Date('2026-11-01T10:00:00'),
    address: '456 Innovation Drive, Austin, TX',
    deadline: new Date('2026-10-30'),
    capacity: 100,
  },
];

const SEED_REGISTRANTS = [
  { email_address: 'john.doe@example.com', registration_no: 1 },
  { email_address: 'jane.smith@example.com', registration_no: 2 },
];

export default async function seed() {
  try {
    const count = await Employee.count();
    if (count > 0) {
      logger.info('Seeding skipped as tables are not empty');
      return;
    }

    const employees = await Employee.bulkCreate(
      SEED_EMPLOYEES.map(name => ({ name })),
    );

    const events = await Event.bulkCreate(
      SEED_EVENTS.map((event, index) => ({
        ...event,
        handler_uuid: employees[index]!.uuid,
      })),
    );

    await Registrant.bulkCreate(
      SEED_REGISTRANTS.map((registrant) => ({
        ...registrant,
        event_uuid: events[0]!.uuid,
      })),
    );

    logger.info('Seeding complete');
  } catch (error) {
    logger.error(error);
    throw new Error();
  }
};
