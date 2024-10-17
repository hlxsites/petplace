import {
  HttpClientRepository,
  HttpResponse,
} from "../repository/HttpClientRepository";

export class MockHttpClient implements HttpClientRepository {
  private data: unknown;
  private error: unknown;
  private statusCode: number;

  constructor({
    data,
    error,
    statusCode,
  }: { data?: unknown; error?: unknown; statusCode?: number } = {}) {
    this.data = data || null;
    this.error = error;
    this.statusCode = statusCode || 500;
  }

  get success(): boolean {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  get defaultResponse(): Promise<HttpResponse> {
    if (this.error) {
      return Promise.resolve({
        error: this.error,
      });
    }

    return Promise.resolve({
      data: this.data,
      statusCode: this.statusCode,
      success: this.success,
    });
  }

  delete(): Promise<HttpResponse> {
    return this.defaultResponse;
  }

  get(): Promise<HttpResponse> {
    return this.defaultResponse;
  }

  post(): Promise<HttpResponse> {
    return this.defaultResponse;
  }

  postFormData(): Promise<HttpResponse> {
    return this.defaultResponse;
  }

  put(): Promise<HttpResponse> {
    return this.defaultResponse;
  }
}
