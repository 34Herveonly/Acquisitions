import { users } from '#models/users.model.js';
import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] || null;
  } catch (e) {
    logger.error('Error getting user by id', e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists first
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Prepare update data with timestamp
    const updateData = {
      ...updates,
      updated_at: new Date(),
    };

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      });

    return result[0];
  } catch (e) {
    logger.error('Error updating user', e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    // Check if user exists first
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    await db.delete(users).where(eq(users.id, id));

    return { success: true, deletedUser: existingUser };
  } catch (e) {
    logger.error('Error deleting user', e);
    throw e;
  }
};
