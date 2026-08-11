import { APIRequestContext, APIResponse } from '@playwright/test';
import { ServiceResponse } from '../types/booking.types';

/**
 * BaseService — thin HTTP abstraction over Playwright's APIRequestContext.
 * All service classes extend this to gain typed request helpers.
 * The baseURL is resolved from playwright.config.ts (use.baseURL).
 */
export abstract class BaseService {
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected async get(
    path: string,
    options?: {
      headers?: Record<string, string>;
      params?: Record<string, string>;
    },
  ): Promise<APIResponse> {
    return this.request.get(path, options);
  }

  protected async post(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.post(path, {
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    });
  }

  protected async put(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.put(path, {
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    });
  }

  protected async patch(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    return this.request.patch(path, {
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    });
  }

  protected async delete(path: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(path, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }

  protected async parseResponse<T>(response: APIResponse): Promise<ServiceResponse<T>> {
    let body: T;
    try {
      body = (await response.json()) as T;
    } catch {
      body = (await response.text()) as unknown as T;
    }
    return { status: response.status(), body };
  }
}
