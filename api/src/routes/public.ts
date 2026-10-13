import { Router } from 'express';
import publicController from '../controllers/publicController.js';

const router = Router();

router.get('/events', publicController.getEvents);
router.post('/register', publicController.register);

export default router;
