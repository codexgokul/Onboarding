import { Router } from 'express';
import {
  getStats,
  getActivityLogs,
  resetDemo
} from '../controllers/statsController.js';

const router = Router();

router.get('/stats', getStats);
router.get('/activity-logs', getActivityLogs);
router.post('/reset-demo', resetDemo);

export default router;
