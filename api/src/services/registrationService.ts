import { Registrant } from '../models/index.js';
import { col, fn, literal } from 'sequelize';
import { stripTime, dateToIsoString } from '../utils/date.js';
import eventService from './eventService.js';

const registrationService = {
  async getRegistrationTrend(eventUuid: string) {
    const event = await eventService.getEventByUuid(eventUuid);
    if (!event) return [];

    const startDate = stripTime(event.createdAt);
    const today = stripTime(new Date());
    const endDate = event.deadline < today ? event.deadline : today;

    // Query registrant counts per day
    const rows = await Registrant.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', literal('*')), 'count'],
      ],
      where: { eventUuid },
      group: [fn('DATE', col('created_at'))],
      raw: true,
    }) as unknown as Array<{ date: string; count: string }>;

    const dailyMap = new Map<string, number>();
    for (const row of rows) {
      dailyMap.set(row.date, Number(row.count));
    }

    const result: Array<{ date: string; registrationCount: number; newRegistrationCount: number }> = [];
    let cumulative = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = dateToIsoString(current);
      const newCount = dailyMap.get(dateStr) ?? 0;
      cumulative += newCount;
      result.push({
        date: dateStr,
        registrationCount: cumulative,
        newRegistrationCount: newCount,
      });
      current.setDate(current.getDate() + 1);
    }

    return result;
  },

  async register(eventUuid: string, emailAddress: string) {
    const { registrationNo } = await Registrant.create({
      eventUuid,
      emailAddress,
    });

    return registrationNo as number;
  },
};

export default registrationService;
