import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports the service as up', () => {
    const result = new HealthController().check();

    expect(result.status).toBe('ok');
    expect(result.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
