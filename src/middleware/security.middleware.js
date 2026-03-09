import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleWare = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin request limit exceeded, slow down';
        break;

      case 'user':
        limit = 10;
        message = 'User request limit exceeded, slow down';
        break;

      case 'guest':
        limit = 5;
        message = 'Guest request limit exceeded';
        break;

      default:
        limit = 5;
        message = 'Request limit exceeded';
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    // Bot protection
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    // Shield protection
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Request blocked by Arcjet shield', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
      });
    }

    // Rate limit protection
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(429).json({
        error: 'Too Many Requests',
        message,
      });
    }

    return next();
  } catch (e) {
    logger.error('Arcjet middleware error', { error: e });

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Security middleware failure',
    });
  }
};

export default securityMiddleWare;