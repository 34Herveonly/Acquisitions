import request from 'supertest';
import app from '#src/app.js';

describe('Security Middleware', () => {
  describe('Test Environment Behavior', () => {
    it('should skip Arcjet protection in test environment', async () => {
      // Verify NODE_ENV is set to test
      expect(process.env.NODE_ENV).toBe('test');

      // Make multiple rapid requests that would normally trigger rate limiting
      const requests = Array.from({ length: 10 }, () =>
        request(app).get('/health')
      );

      const responses = await Promise.all(requests);

      // All requests should succeed (no rate limiting in test mode)
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle requests without IP addresses gracefully', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Acquisitions Api is running',
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests without crashing', async () => {
      const response = await request(app)
        .post('/api')
        .send('invalid-json')
        .set('Content-Type', 'application/json');

      // Should not crash the server
      expect([400, 404]).toContain(response.status);
    });
  });
});
