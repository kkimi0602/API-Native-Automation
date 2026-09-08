import { APIRequestContext } from '@playwright/test';
import { AuthTokenResponse, IAuthService, ServiceResponse } from '../types/booking.types';
import { BaseService } from './base.service';

export class AuthService extends BaseService implements IAuthService {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Returns a valid auth token. Throws if credentials are invalid.
   */
  async createToken(username: string, password: string): Promise<string> {
    const response = await this.post('/auth', { username, password });
    const body = await this.parseSuccessfulResponse<AuthTokenResponse>(response);

    if (!body.token) {
      throw new Error(`Authentication failed: ${body.reason ?? 'Unknown error'}`);
    }

    return body.token;
  }

  /**
   * Returns the raw auth response — suitable for negative-scenario assertions.
   */
  async createTokenResponse(
    username: string,
    password: string,
  ): Promise<ServiceResponse<AuthTokenResponse>> {
    const response = await this.post('/auth', { username, password });
    return this.parseResponse<AuthTokenResponse>(response);
  }
}
