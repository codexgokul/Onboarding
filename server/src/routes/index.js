import { Router } from 'express';
import employeeRoutes from './employeeRoutes.js';
import taskRoutes from './taskRoutes.js';
import emailRoutes from './emailRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import statsRoutes from './statsRoutes.js';

const router = Router();

// API Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'TalentFlow Onboarding Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount resource routes
router.use('/employees', employeeRoutes);
router.use('/tasks', taskRoutes);
router.use('/email-requests', emailRoutes);
router.use('/', permissionRoutes);
router.use('/', statsRoutes);

export default router;
