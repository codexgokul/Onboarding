import { Router } from 'express';
import {
  getEmailRequests,
  createEmailRequest,
  updateEmailStatus
} from '../controllers/emailController.js';

const router = Router();

router.get('/', getEmailRequests);
router.post('/', createEmailRequest);
router.patch('/:id/status', updateEmailStatus);

export default router;
