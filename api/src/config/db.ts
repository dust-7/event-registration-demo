import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import { logger } from '../utils/logger.js';

dotenv.config();

if (!process.env.DB_NAME || !process.env.DB_USER) {
  throw new Error('Following environment variables are required in .env: DB_NAME, DB_USER');
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
  }
);

export default sequelize;
