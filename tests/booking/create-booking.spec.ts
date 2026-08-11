import { test, expect } from '../../src/fixtures/api.fixtures';
import { BookingFactory } from '../../src/factories/booking.factory';

test.describe('Booking API — Create (POST /booking)', () => {
  test('should create a booking with default factory data', async ({ bookingService }) => {
    const bookingData = BookingFactory.createDefault();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeTruthy();
    expect(typeof response.bookingid).toBe('number');
    expect(response.booking.firstname).toBe(bookingData.firstname);
    expect(response.booking.lastname).toBe(bookingData.lastname);
    expect(response.booking.totalprice).toBe(bookingData.totalprice);
    expect(response.booking.depositpaid).toBe(bookingData.depositpaid);
    expect(response.booking.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);
    expect(response.booking.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
  });

  test('should create a booking with Faker-generated data', async ({ bookingService }) => {
    const bookingData = BookingFactory.createWithFaker();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeTruthy();
    expect(response.booking.firstname).toBe(bookingData.firstname);
    expect(response.booking.lastname).toBe(bookingData.lastname);
    expect(response.booking.totalprice).toBe(bookingData.totalprice);
    expect(response.booking.depositpaid).toBe(bookingData.depositpaid);
  });

  test('should create a booking using the Builder pattern', async ({ bookingService }) => {
    const bookingData = BookingFactory.builder()
      .withFirstname('Alice')
      .withLastname('Wonderland')
      .withTotalPrice(350)
      .withDepositPaid(false)
      .withCheckin('2026-03-01')
      .withCheckout('2026-03-07')
      .withAdditionalNeeds('Late Checkout')
      .build();

    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeTruthy();
    expect(response.booking.firstname).toBe('Alice');
    expect(response.booking.lastname).toBe('Wonderland');
    expect(response.booking.totalprice).toBe(350);
    expect(response.booking.depositpaid).toBe(false);
    expect(response.booking.additionalneeds).toBe('Late Checkout');
    expect(response.booking.bookingdates.checkin).toBe('2026-03-01');
    expect(response.booking.bookingdates.checkout).toBe('2026-03-07');
  });

  test('should create a booking without additionalneeds field', async ({ bookingService }) => {
    const bookingData = BookingFactory.builder().withoutAdditionalNeeds().build();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeTruthy();
  });

  test('should retrieve all booking IDs', async ({ bookingService }) => {
    const bookings = await bookingService.getBookings();

    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);

    bookings.forEach((b) => {
      expect(typeof b.bookingid).toBe('number');
    });
  });

  test('should filter bookings by firstname and lastname', async ({ bookingService }) => {
    const bookingData = BookingFactory.builder()
      .withFirstname('UniqueFirst')
      .withLastname('UniqueLast')
      .build();

    await bookingService.createBooking(bookingData);

    const filtered = await bookingService.getBookings({
      firstname: 'UniqueFirst',
      lastname: 'UniqueLast',
    });

    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((b) => {
      expect(typeof b.bookingid).toBe('number');
    });
  });

  test('should retrieve a specific booking by ID', async ({ bookingService }) => {
    const bookingData = BookingFactory.createWithFaker();
    const created = await bookingService.createBooking(bookingData);

    const retrieved = await bookingService.getBooking(created.bookingid);

    expect(retrieved.firstname).toBe(bookingData.firstname);
    expect(retrieved.lastname).toBe(bookingData.lastname);
    expect(retrieved.totalprice).toBe(bookingData.totalprice);
    expect(retrieved.depositpaid).toBe(bookingData.depositpaid);
    expect(retrieved.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);
    expect(retrieved.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
  });
});
