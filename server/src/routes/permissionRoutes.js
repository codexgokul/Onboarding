import { Router } from 'express';
import {
  getSoftwareCatalog,
  getPermissions,
  assignPermission,
  updatePermissionStatus,
  revokePermission
} from '../controllers/permissionController.js';

const router = Router();

router.get('/software/catalog', getSoftwareCatalog);
router.get('/permissions', getPermissions);
router.post('/permissions', assignPermission);
router.patch('/permissions/:id/status', updatePermissionStatus);
router.delete('/permissions/:id', revokePermission);

export default router;
