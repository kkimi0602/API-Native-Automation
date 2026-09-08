// ─── Domain Models ────────────────────────────────────────────────────────────

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingId {
  bookingid: number;
}

export interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

// ─── Auth Models ──────────────────────────────────────────────────────────────

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthTokenResponse {
  token?: string;
  reason?: string;
}

// ─── Filter Models ────────────────────────────────────────────────────────────

export interface BookingFilter {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

// ─── Generic Service Response (for raw/negative test scenarios) ───────────────

export interface ServiceResponse<T = unknown> {
  status: number;
  body: T;
}

// ─── Service Interfaces (Dependency Inversion) ────────────────────────────────

export interface IAuthService {
  createToken(username: string, password: string): Promise<string>;
  createTokenResponse(
    username: string,
    password: string,
  ): Promise<ServiceResponse<AuthTokenResponse>>;
}

export interface IBookingService {
  getBookings(filter?: BookingFilter): Promise<BookingId[]>;
  getBooking(id: number): Promise<Booking>;
  getBookingRaw(id: number): Promise<ServiceResponse<unknown>>;
  createBooking(booking: Booking): Promise<CreateBookingResponse>;
  createBookingRaw(booking: unknown): Promise<ServiceResponse<unknown>>;
  updateBooking(id: number, booking: Booking, token: string): Promise<Booking>;
  updateBookingRaw(id: number, booking: unknown, token?: string): Promise<ServiceResponse<unknown>>;
  partialUpdateBooking(id: number, booking: Partial<Booking>, token: string): Promise<Booking>;
  deleteBooking(id: number, token: string): Promise<number>;
  deleteBookingRaw(id: number, token?: string): Promise<ServiceResponse<unknown>>;
}
