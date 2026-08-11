import { faker } from '@faker-js/faker';
import { Booking, BookingDates } from '../types/booking.types';

/**
 * BookingBuilder — Fluent builder for constructing Booking payloads.
 * Follows the Builder design pattern, enabling expressive test-data setup.
 */
export class BookingBuilder {
  private booking: Booking = {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-01',
      checkout: '2025-01-10',
    },
    additionalneeds: 'Breakfast',
  };

  withFirstname(firstname: string): this {
    this.booking.firstname = firstname;
    return this;
  }

  withLastname(lastname: string): this {
    this.booking.lastname = lastname;
    return this;
  }

  withTotalPrice(price: number): this {
    this.booking.totalprice = price;
    return this;
  }

  withDepositPaid(paid: boolean): this {
    this.booking.depositpaid = paid;
    return this;
  }

  withBookingDates(dates: BookingDates): this {
    this.booking.bookingdates = { ...dates };
    return this;
  }

  withCheckin(date: string): this {
    this.booking.bookingdates.checkin = date;
    return this;
  }

  withCheckout(date: string): this {
    this.booking.bookingdates.checkout = date;
    return this;
  }

  withAdditionalNeeds(needs: string): this {
    this.booking.additionalneeds = needs;
    return this;
  }

  withoutAdditionalNeeds(): this {
    delete this.booking.additionalneeds;
    return this;
  }

  build(): Booking {
    return {
      ...this.booking,
      bookingdates: { ...this.booking.bookingdates },
    };
  }
}

/**
 * BookingFactory — Factory for creating Booking payloads.
 * Uses the Builder pattern internally and integrates Faker.js for dynamic data.
 */
export class BookingFactory {
  static builder(): BookingBuilder {
    return new BookingBuilder();
  }

  /**
   * Creates a booking with hardcoded default values.
   * Useful when reproducibility matters more than uniqueness.
   */
  static createDefault(): Booking {
    return BookingFactory.builder().build();
  }

  /**
   * Creates a booking with Faker.js-generated random data.
   * Ensures unique data per test run to avoid ID collisions.
   */
  static createWithFaker(): Booking {
    const checkinDate = faker.date.soon({ days: 30 });
    const checkoutDate = faker.date.soon({ days: 10, refDate: checkinDate });

    const needs = faker.helpers.arrayElement([
      'Breakfast',
      'Lunch',
      'Dinner',
      'Extra Pillow',
      'Late Checkout',
      '',
    ]);

    return BookingFactory.builder()
      .withFirstname(faker.person.firstName())
      .withLastname(faker.person.lastName())
      .withTotalPrice(faker.number.int({ min: 50, max: 2000 }))
      .withDepositPaid(faker.datatype.boolean())
      .withCheckin(checkinDate.toISOString().split('T')[0])
      .withCheckout(checkoutDate.toISOString().split('T')[0])
      .withAdditionalNeeds(needs)
      .build();
  }
}
