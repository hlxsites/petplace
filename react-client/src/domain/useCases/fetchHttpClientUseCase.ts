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

  async get(path: string, options: HttpOptions = {}): Promise<HttpResponse> {
    console.log("###path", path);
    console.log("###options", options);
    try {
      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "GET",
        headers: options.headers,
      });

      console.log("### result", result);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await result.json();
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await result.json();
      return { data, statusCode: result.status };
    } catch (error) {
      return { error };
    }
  }
}
