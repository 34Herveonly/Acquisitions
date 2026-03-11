import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

// Create Arcjet instance with environment-aware configuration
const aj = arcjet({
  key: process.env.ARCJET_KEY || 'test-key-placeholder',
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({
      mode: process.env.NODE_ENV === 'test' ? 'DRY_RUN' : 'LIVE',
    }),
    // Create a bot detection rule
    detectBot({
      mode: process.env.NODE_ENV === 'test' ? 'DRY_RUN' : 'LIVE',
      // Block all bots except the following
      allow: [
        'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
      mode: process.env.NODE_ENV === 'test' ? 'DRY_RUN' : 'LIVE',
      interval: '60s',
      max: 3,
    }),
  ],
});

export default aj;
