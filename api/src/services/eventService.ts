import { Event, Employee } from '../models/index.js';
import { Op, col, type WhereOptions } from 'sequelize';
import { dateToIsoString } from '../utils/date.js';

const PAGE_SIZE = 10;

const eventService = {
  async listPublicEvents() {
    const today = dateToIsoString(new Date());

    return Event.findAll({
      where: {
        [Op.and]: [
          { deadline: { [Op.gte]: today } },
          { registrationCount: { [Op.lt]: col('capacity') } },
        ],
      },
      order: [['dateTime', 'ASC']],
    });
  },

  async listAdminEvents(page: number, search?: string, open?: boolean) {
    let where: WhereOptions = {};

    if (search) {
      where = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { '$handler.name$': { [Op.like]: `%${search}%` } },
        ]
      };
    }

    if (open) {
      const today = dateToIsoString(new Date());

      where = {
        ...where,
        [Op.and]: [
          { deadline: { [Op.gte]: today } },
          { registrationCount: { [Op.lt]: col('capacity') } },
        ],
      };
    }

    // total events
    const total = await Event.count({
      where,
      include: [
        {
          model: Employee,
          as: 'handler',
        },
      ],
    });

    const events = await Event.findAll({
      where,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      order: [['dateTime', 'ASC']],
      include: [
        {
          model: Employee,
          as: 'handler',
          attributes: ['uuid', 'name'],
        },
      ],
    });

    return { total, events };
  },

  async getEventByUuid(uuid: string) {
    return Event.findByPk(uuid);
  },

  async getHandlerOpenEvent(handlerUuid: string, deadline: Date) {
    return Event.findOne({
      where: {
        handlerUuid,
        [Op.and]: [
          { deadline: { [Op.gte]: deadline } },
          { registrationCount: { [Op.lt]: col('capacity') } },
        ],
      },
    });
  },

  async getEventByName(name: string) {
    return Event.findOne({ where: { name } });
  },

  async createEvent(
    name: string,
    dateTime: string,
    address: string,
    deadline: string,
    capacity: number,
    handlerUuid: string
  ) {
    await Event.create({
      name,
      dateTime: new Date(dateTime),
      address,
      deadline: new Date(deadline),
      capacity,
      handlerUuid: handlerUuid,
    });
  },
};

export default eventService;
