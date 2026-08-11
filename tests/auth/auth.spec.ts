import { test, expect } from '../../src/fixtures/api.fixtures';

test.describe('Authentication API — POST /auth', () => {
  test('should return a valid token with correct credentials', async ({ authService }) => {
    const token = await authService.createToken('admin', 'password123');

    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('should return "Bad credentials" with an invalid password', async ({ authService }) => {
    const response = await authService.createTokenResponse('admin', 'wrongpassword');

    expect(response.status).toBe(200);
    expect(response.body.reason).toBe('Bad credentials');
    expect(response.body.token).toBeUndefined();
  });

  test('should return "Bad credentials" with an invalid username', async ({ authService }) => {
    const response = await authService.createTokenResponse('wronguser', 'password123');

    expect(response.status).toBe(200);
    expect(response.body.reason).toBe('Bad credentials');
  });

  test('should return "Bad credentials" with empty credentials', async ({ authService }) => {
    const response = await authService.createTokenResponse('', '');

    expect(response.status).toBe(200);
    expect(response.body.reason).toBe('Bad credentials');
  });

  test('should throw when createToken is called with invalid credentials', async ({
    authService,
  }) => {
    await expect(authService.createToken('invalid', 'invalid')).rejects.toThrow(
      'Authentication failed',
    );
  });
});
