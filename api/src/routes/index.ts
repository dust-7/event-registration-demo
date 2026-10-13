import { Router } from 'express';
import adminRouter from './admin.js';
import publicRouter from './public.js';

const router = Router();

router.use('/admin', adminRouter);
router.use('/public', publicRouter);

export default router;
