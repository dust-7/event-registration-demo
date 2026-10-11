import { Router, type Request, type Response, type NextFunction } from 'express';

const router: Router = Router();

/* GET users listing. */
router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.send('respond with a public resource');
});

export default router;
