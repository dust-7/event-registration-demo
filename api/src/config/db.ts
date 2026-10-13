import { Sequelize } from 'sequelize';

import { logger } from '../utils/logger.js';

if (!process.env.DB_NAME || !process.env.DB_USER) {
  logger.error('DB_NAME and DB_USER must be set');
  throw new Error();
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306'),
    dialect: 'mysql',
    logging: (msg: string) => logger.info(msg),
    define: {
      underscored: true,
    },
  }
);

export default sequelize;
