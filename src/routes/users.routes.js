import express from 'express';
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controller/users.controller.js';
import { authenticate } from '#middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', fetchAllUsers);
router.get('/:id', fetchUserById);

// Protected routes (authentication required)
router.put('/:id', authenticate, updateUserById);
router.delete('/:id', authenticate, deleteUserById);

export default router;
