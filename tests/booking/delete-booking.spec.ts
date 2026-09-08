import { test, expect } from '../../src/fixtures/api.fixtures';
import { BookingFactory } from '../../src/factories/booking.factory';

test.describe('Booking API — Delete (DELETE /booking/:id)', () => {
  test('should delete a booking and return 201', async ({ bookingService, authToken }) => {
    const bookingData = BookingFactory.createWithFaker();
    const created = await bookingService.createBooking(bookingData);

    const status = await bookingService.deleteBooking(created.bookingid, authToken);

    expect(status).toBe(201);
  });

  test('should make the booking unretrievable after deletion', async ({
    bookingService,
    authToken,
  }) => {
    const bookingData = BookingFactory.createWithFaker();
    const created = await bookingService.createBooking(bookingData);

    await bookingService.deleteBooking(created.bookingid, authToken);

    const response = await bookingService.getBookingRaw(created.bookingid);
    expect(response.status).toBe(404);
  });

  test('should remove the booking from filtered listings after deletion', async ({
    bookingService,
    authToken,
  }) => {
    const bookingData = BookingFactory.builder()
      .withFirstname('ToDelete')
      .withLastname('SoonGone')
      .build();

    const created = await bookingService.createBooking(bookingData);
    await bookingService.deleteBooking(created.bookingid, authToken);

    const listings = await bookingService.getBookings({
      firstname: 'ToDelete',
      lastname: 'SoonGone',
    });
    expect(listings.some((booking) => booking.bookingid === created.bookingid)).toBe(false);
  });
});
