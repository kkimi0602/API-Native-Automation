import { test, expect } from '../../src/fixtures/api.fixtures';
import { BookingFactory } from '../../src/factories/booking.factory';

test.describe('Negative Scenarios', () => {
  // ─── Authorization — missing / invalid token ─────────────────────────────────

  test.describe('Update — missing auth token', () => {
    test('should return 403 when updating without a token', async ({
      bookingService,
      createdBookings,
    }) => {
      const created = await bookingService.createBooking(BookingFactory.createWithFaker());
      createdBookings.add(created.bookingid);

      const response = await bookingService.updateBookingRaw(
        created.bookingid,
        BookingFactory.createDefault(),
      );

      expect(response.status).toBe(403);
    });

    test('should return 403 when updating with an invalid token', async ({
      bookingService,
      createdBookings,
    }) => {
      const created = await bookingService.createBooking(BookingFactory.createWithFaker());
      createdBookings.add(created.bookingid);

      const response = await bookingService.updateBookingRaw(
        created.bookingid,
        BookingFactory.createDefault(),
        'totallywrongtoken',
      );

      expect(response.status).toBe(403);
    });
  });

  test.describe('Delete — missing / invalid auth token', () => {
    test('should return 403 when deleting without a token', async ({
      bookingService,
      createdBookings,
    }) => {
      const created = await bookingService.createBooking(BookingFactory.createWithFaker());
      createdBookings.add(created.bookingid);

      const response = await bookingService.deleteBookingRaw(created.bookingid);

      expect(response.status).toBe(403);
    });

    test('should return 403 when deleting with an empty token string', async ({
      bookingService,
      createdBookings,
    }) => {
      const created = await bookingService.createBooking(BookingFactory.createWithFaker());
      createdBookings.add(created.bookingid);

      const response = await bookingService.deleteBookingRaw(created.bookingid, '');

      expect(response.status).toBe(403);
    });

    test('should return 403 when deleting with a malformed token', async ({
      bookingService,
      createdBookings,
    }) => {
      const created = await bookingService.createBooking(BookingFactory.createWithFaker());
      createdBookings.add(created.bookingid);

      const response = await bookingService.deleteBookingRaw(created.bookingid, 'invalidtoken999');

      expect(response.status).toBe(403);
    });
  });

  // ─── Non-existent Resources ──────────────────────────────────────────────────

  test.describe('Non-existent resources', () => {
    test('should return 404 for a non-existent booking ID', async ({ bookingService }) => {
      const response = await bookingService.getBookingRaw(999_999_999);

      expect(response.status).toBe(404);
    });
  });

  // ─── Malformed / missing payload ─────────────────────────────────────────────

  test.describe('Invalid booking payload', () => {
    test('should handle a payload with missing required fields', async ({ bookingService }) => {
      const response = await bookingService.createBookingRaw({
        firstname: 'OnlyFirst',
        // lastname, totalprice, depositpaid, bookingdates are all missing
      });

      expect(response.status).toBe(500);
    });

    test('should handle an empty payload', async ({ bookingService }) => {
      const response = await bookingService.createBookingRaw({});

      expect(response.status).toBe(500);
    });
  });
});
