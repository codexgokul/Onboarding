import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  submitProof,
  validateTask
} from '../controllers/taskController.js';

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.post('/:id/submit-proof', submitProof);
router.post('/:id/validate', validateTask);

export default router;
