import { test as base } from '@playwright/test';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { IAuthService, IBookingService } from '../types/booking.types';

const API_USERNAME = process.env.API_USERNAME ?? 'admin';
const API_PASSWORD = process.env.API_PASSWORD ?? 'password123';

/**
 * ApiFixtures — custom Playwright fixture types.
 * Services are injected via the fixture mechanism, satisfying
 * the Dependency Inversion principle: specs depend on interfaces, not classes.
 */
type ApiFixtures = {
  authService: IAuthService;
  bookingService: IBookingService;
  authToken: string;
};

export const test = base.extend<ApiFixtures>({
  authService: async ({ request }, use) => {
    await use(new AuthService(request));
  },

  bookingService: async ({ request }, use) => {
    await use(new BookingService(request));
  },

  /**
   * authToken — resolves a fresh token once per test.
   * Tests that need auth simply declare `authToken` in their parameter list.
   */
  authToken: async ({ authService }, use) => {
    const token = await authService.createToken(API_USERNAME, API_PASSWORD);
    await use(token);
  },
});

export { expect } from '@playwright/test';
