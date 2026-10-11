import express, { type Request, type Response, type NextFunction } from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';

import router from './routes/index.js';

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/requests.log' }),
  ],
}));

app.use('/api', router);

app.use('/{*splat}', (_req: Request, res: Response) => {
  res.status(400).json({ error: 'Route not found' });
});

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log' })
  ],
}));

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

export default app;
