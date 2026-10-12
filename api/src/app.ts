import express, { type Request, type Response, type NextFunction } from 'express';
import expressWinston from 'express-winston';

import { logger, myTransports } from './utils/logger.js';
import router from './routes/index.js';
import sequelize from './config/db.js';
import seed from './config/seed.js';

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressWinston.logger({
  transports: [myTransports.console, myTransports.general],
}));

// routes
app.use('/api', router);
app.use('/{*splat}', (_req: Request, res: Response) => {
  res.status(400).json({ error: 'Route not found' });
});

// errors
app.use(expressWinston.errorLogger({
  transports: [myTransports.console, myTransports.error],
}));
app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

// database
await sequelize.sync();
await seed();

app.listen(port, () => {
  logger.info(`API server listening on port ${port}`);
});

export default app;
