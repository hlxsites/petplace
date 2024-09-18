import {
  HttpClientRepository,
  HttpResponse,
} from "../repository/HttpClientRepository";

export class MockHttpClient implements HttpClientRepository {
  private data: unknown;
  private error: unknown;

  constructor({ data, error }: { data?: unknown; error?: unknown } = {}) {
    this.data = data;
    this.error = error;
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
      // @ts-expect-error - this is a mock implementation
      return { error: this.error };
    }

    // @ts-expect-error - this is a mock implementation
    return { data: this.data };
  }

  postFormData(): Promise<HttpResponse> {
    if (this.error) {
      // @ts-expect-error - this is a mock implementation
      return { error: this.error };
    }

    // @ts-expect-error - this is a mock implementation
    return { data: this.data };
  }
}
