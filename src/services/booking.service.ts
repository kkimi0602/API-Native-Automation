import { APIRequestContext } from '@playwright/test';
import {
  Booking,
  BookingFilter,
  BookingId,
  CreateBookingResponse,
  IBookingService,
  ServiceResponse,
} from '../types/booking.types';
import { BaseService } from './base.service';

export class BookingService extends BaseService implements IBookingService {
  constructor(request: APIRequestContext) {
    super(request);
  }

  // ─── Read ──────────────────────────────────────────────────────────────────

  async getBookings(filter?: BookingFilter): Promise<BookingId[]> {
    const params: Record<string, string> = {};
    if (filter?.firstname) params['firstname'] = filter.firstname;
    if (filter?.lastname) params['lastname'] = filter.lastname;
    if (filter?.checkin) params['checkin'] = filter.checkin;
    if (filter?.checkout) params['checkout'] = filter.checkout;

    const response = await this.get('/booking', { params });
    return response.json() as Promise<BookingId[]>;
  }

  async getBooking(id: number): Promise<Booking> {
    const response = await this.get(`/booking/${id}`, {
      headers: { Accept: 'application/json' },
    });
    return response.json() as Promise<Booking>;
  }

  async getBookingRaw(id: number): Promise<ServiceResponse<unknown>> {
    const response = await this.get(`/booking/${id}`, {
      headers: { Accept: 'application/json' },
    });
    return this.parseResponse(response);
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  async createBooking(booking: Booking): Promise<CreateBookingResponse> {
    const response = await this.post('/booking', booking);
    return response.json() as Promise<CreateBookingResponse>;
  }

  async createBookingRaw(booking: unknown): Promise<ServiceResponse<unknown>> {
    const response = await this.post('/booking', booking);
    return this.parseResponse(response);
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  async updateBooking(id: number, booking: Booking, token: string): Promise<Booking> {
    const response = await this.put(`/booking/${id}`, booking, {
      Cookie: `token=${token}`,
    });
    return response.json() as Promise<Booking>;
  }

  async updateBookingRaw(
    id: number,
    booking: unknown,
    token?: string,
  ): Promise<ServiceResponse<unknown>> {
    const headers: Record<string, string> = {};
    if (token !== undefined) headers['Cookie'] = `token=${token}`;

    const response = await this.put(`/booking/${id}`, booking, headers);
    return this.parseResponse(response);
  }

  async partialUpdateBooking(
    id: number,
    booking: Partial<Booking>,
    token: string,
  ): Promise<Booking> {
    const response = await this.patch(`/booking/${id}`, booking, {
      Cookie: `token=${token}`,
    });
    return response.json() as Promise<Booking>;
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  /**
   * Returns the HTTP status code (expects 201 on success).
   */
  async deleteBooking(id: number, token: string): Promise<number> {
    const response = await this.delete(`/booking/${id}`, {
      Cookie: `token=${token}`,
    });
    return response.status();
  }

  async deleteBookingRaw(id: number, token?: string): Promise<ServiceResponse<unknown>> {
    const headers: Record<string, string> = {};
    if (token !== undefined) headers['Cookie'] = `token=${token}`;

    const response = await this.delete(`/booking/${id}`, headers);
    return this.parseResponse(response);
  }
}
