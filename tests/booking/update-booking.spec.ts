import { test, expect } from '../../src/fixtures/api.fixtures';
import { BookingFactory } from '../../src/factories/booking.factory';

test.describe('Booking API — Update', () => {
  test.describe('PUT /booking/:id — Full Update', () => {
    test('should fully replace a booking with valid token', async ({
      bookingService,
      authToken,
      createdBookings,
    }) => {
      const original = BookingFactory.createWithFaker();
      const created = await bookingService.createBooking(original);
      createdBookings.add(created.bookingid);

      const updated = BookingFactory.builder()
        .withFirstname('Updated')
        .withLastname('User')
        .withTotalPrice(999)
        .withDepositPaid(true)
        .withCheckin('2026-06-01')
        .withCheckout('2026-06-14')
        .withAdditionalNeeds('Extra Pillow')
        .build();

      const result = await bookingService.updateBooking(created.bookingid, updated, authToken);

      expect(result.firstname).toBe('Updated');
      expect(result.lastname).toBe('User');
      expect(result.totalprice).toBe(999);
      expect(result.depositpaid).toBe(true);
      expect(result.bookingdates.checkin).toBe('2026-06-01');
      expect(result.bookingdates.checkout).toBe('2026-06-14');
      expect(result.additionalneeds).toBe('Extra Pillow');
    });

    test('should persist the full update when re-fetched', async ({
      bookingService,
      authToken,
      createdBookings,
    }) => {
      const original = BookingFactory.createWithFaker();
      const created = await bookingService.createBooking(original);
      createdBookings.add(created.bookingid);

      const updated = BookingFactory.builder()
        .withFirstname('Persisted')
        .withLastname('Check')
        .withTotalPrice(777)
        .withDepositPaid(false)
        .withCheckin('2026-07-10')
        .withCheckout('2026-07-20')
        .build();

      await bookingService.updateBooking(created.bookingid, updated, authToken);

      const fetched = await bookingService.getBooking(created.bookingid);
      expect(fetched.firstname).toBe('Persisted');
      expect(fetched.lastname).toBe('Check');
      expect(fetched.totalprice).toBe(777);
    });
  });

  test.describe('PATCH /booking/:id — Partial Update', () => {
    test('should partially update firstname and lastname', async ({
      bookingService,
      authToken,
      createdBookings,
    }) => {
      const original = BookingFactory.createWithFaker();
      const created = await bookingService.createBooking(original);
      createdBookings.add(created.bookingid);

      const result = await bookingService.partialUpdateBooking(
        created.bookingid,
        { firstname: 'Patched', lastname: 'Name' },
        authToken,
      );

      expect(result.firstname).toBe('Patched');
      expect(result.lastname).toBe('Name');
      // unchanged fields must be preserved
      expect(result.totalprice).toBe(original.totalprice);
      expect(result.depositpaid).toBe(original.depositpaid);
    });

    test('should partially update booking dates', async ({
      bookingService,
      authToken,
      createdBookings,
    }) => {
      const original = BookingFactory.createWithFaker();
      const created = await bookingService.createBooking(original);
      createdBookings.add(created.bookingid);

      const result = await bookingService.partialUpdateBooking(
        created.bookingid,
        { bookingdates: { checkin: '2027-09-01', checkout: '2027-09-15' } },
        authToken,
      );

      expect(result.bookingdates.checkin).toBe('2027-09-01');
      expect(result.bookingdates.checkout).toBe('2027-09-15');
    });

    test('should partially update totalprice', async ({
      bookingService,
      authToken,
      createdBookings,
    }) => {
      const original = BookingFactory.createWithFaker();
      const created = await bookingService.createBooking(original);
      createdBookings.add(created.bookingid);

      const result = await bookingService.partialUpdateBooking(
        created.bookingid,
        { totalprice: 1 },
        authToken,
      );

      expect(result.totalprice).toBe(1);
      expect(result.firstname).toBe(original.firstname);
    });
  });
});
