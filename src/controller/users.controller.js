import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';
import { formatValidationError } from '../utils/format.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error('Error fetching all users', e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    logger.info(`Getting user by id: ${id}`);

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
    }

    res.json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (e) {
    logger.error('Error fetching user by id', e);
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const paramValidation = userIdSchema.safeParse(req.params);
    const bodyValidation = updateUserSchema.safeParse(req.body);

    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramValidation.error),
      });
    }

    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const { id } = paramValidation.data;
    const updates = bodyValidation.data;

    // Authorization check: users can only update their own info, except admins
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own information',
      });
    }

    // Only admins can change user roles
    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can change user roles',
      });
    }

    logger.info(`Updating user ${id}`, { updates, updatedBy: req.user.id });

    const updatedUser = await updateUser(id, updates);

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error('Error updating user', e);

    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
    }

    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Users cannot delete their own account, only admins can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can delete users',
      });
    }

    // Prevent admins from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot delete your own account',
      });
    }

    logger.info(`Deleting user ${id}`, { deletedBy: req.user.id });

    const result = await deleteUser(id);

    res.json({
      message: 'User deleted successfully',
      deletedUser: result.deletedUser,
    });
  } catch (e) {
    logger.error('Error deleting user', e);

    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
    }

    next(e);
  }
};

// Keep the default export for backward compatibility
export default fetchAllUsers;
