import { Router } from 'express';
import adminController from '../controllers/adminController.js';

const router = Router();

router.get('/employees', adminController.getEmployees);
router.get('/events', adminController.getEvents);
router.post('/events', adminController.createEvent);
router.post('/events/:uuid/trend', adminController.getEventRegistrationTrend);

export default router;
