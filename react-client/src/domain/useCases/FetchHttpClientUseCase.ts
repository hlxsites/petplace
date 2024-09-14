import {
  HttpClientRepository,
  HttpOptions,
  HttpResponse,
} from "../repository/HttpClientRepository";

export class FetchHttpClientUseCase implements HttpClientRepository {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(
    path: string,
    options: HttpOptions = {},
    responseType: "json" | "blob" = "json"
  ): Promise<HttpResponse> {
    try {
      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "GET",
        headers: options.headers,
      });

      let data: unknown;

      // Handle different response types
      if (responseType === "blob") {
        data = await result.blob();
      } else {
        data = await result.json();
      }

      return { data, statusCode: result.status };
    } catch (error) {
      return { error };
    }
  }

  async post(path: string, options: HttpOptions = {}): Promise<HttpResponse> {
    try {
      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "POST",
        headers: options.headers,
      });

      const data: unknown = await result.json();

      return { data, statusCode: result.status };
    } catch (error) {
      return { error };
    }
  }
}
