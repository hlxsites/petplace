import {
  HttpClientRepository,
  HttpResponse,
} from "../repository/HttpClientRepository";

export class MockHttpClient implements HttpClientRepository {
  private data: unknown;
  private error: unknown;
  private statusCode?: number;

  constructor({
    data,
    error,
    statusCode,
  }: { data?: unknown; error?: unknown; statusCode?: number } = {}) {
    this.data = data;
    this.error = error;
    this.statusCode = statusCode;
  }

  delete(): Promise<HttpResponse> {
    if (this.error) {
      // @ts-expect-error - this is a mock implementation
      return { error: this.error };
    }

    // @ts-expect-error - this is a mock implementation
    return { data: this.data };
  }

  get(): Promise<HttpResponse> {
    if (this.error) {
      // @ts-expect-error - this is a mock implementation
      return { error: this.error };
    }

    // @ts-expect-error - this is a mock implementation
    return { data: this.data };
  }

  post(): Promise<HttpResponse> {
    if (this.error) {
      return Promise.resolve({ error: this.error });
    }

    // @ts-expect-error - this is a mock implementation
    return Promise.resolve({
      data: this.data,
      statusCode: this.statusCode,
    });
  }

  postFormData(): Promise<HttpResponse> {
    if (this.error) {
      // @ts-expect-error - this is a mock implementation
      return { error: this.error };
    }

    // @ts-expect-error - this is a mock implementation
    return { data: this.data };
  }

  put(): Promise<HttpResponse> {
    if (this.error) {
      return Promise.resolve({
        error: this.error,
      });
    }
    if (this.statusCode === 204) {
      return Promise.resolve({
        data: null,
        statusCode: this.statusCode,
      });
    }

    // @ts-expect-error - this is a mock implementation
    return Promise.resolve({
      data: this.data,
    });
  }
}
