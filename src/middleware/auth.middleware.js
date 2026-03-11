import logger from '#config/logger.js';
import { jwttoken } from '../utils/jwt.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;

    next();
  } catch (e) {
    logger.error('Authentication error', e);

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    next();
  } catch (e) {
    logger.error('Authorization error', e);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authorization check failed',
    });
  }
};
