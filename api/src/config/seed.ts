import { logger } from '../utils/logger.js';
import { Employee, Event, Registrant } from '../models/index.js';

const SEED_EMPLOYEES = ['Alice', 'Bob', 'Charlie'];

const SEED_EVENTS = [
  {
    name: 'Tech Conference 2026',
    dateTime: new Date('2026-11-15T09:00:00'),
    address: '10 Bayfront Avenue, Singapore 018956',
    deadline: new Date('2026-11-10'),
    capacity: 500,
    registrationCount: 2,
  },
  {
    name: 'Summer Music Festival',
    dateTime: new Date('2026-11-15T18:00:00'),
    address: '123 Park Avenue, Central Park, New York, NY 10001',
    deadline: new Date('2026-11-10'),
    capacity: 100,
  },
];

const SEED_REGISTRANTS = [
  { emailAddress: 'john.doe@example.com', registrationNo: 1 },
  { emailAddress: 'jane.smith@example.com', registrationNo: 2 },
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
        handlerUuid: employees[index]!.uuid,
      })),
    );

    await Registrant.bulkCreate(
      SEED_REGISTRANTS.map((registrant) => ({
        ...registrant,
        eventUuid: events[0]!.uuid,
      })),
    );

    logger.info('Seeding complete');
  } catch (error) {
    logger.error(error);
    throw new Error();
  }
};
