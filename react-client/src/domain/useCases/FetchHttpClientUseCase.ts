import {
  HttpClientRepository,
  HttpOptions,
  HttpResponse,
} from "../repository/HttpClientRepository";

export class FetchHttpClientUseCase implements HttpClientRepository {
  private baseUrl: string;

  constructor(defaultUrl: string) {
    const baseUrl = defaultUrl.replace(/\/api$/, "");
    this.baseUrl = baseUrl;
  }

  delete = async (
    path: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse> => {
    try {
      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "DELETE",
        headers: options.headers,
      });

      return { data: true, statusCode: result.status };
    } catch (error) {
      return { error };
    }
  };

  get = async (
    path: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse> => {
    try {
      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "GET",
        headers: options.headers,
      });

      const data: unknown = await (async () => {
        if (options.responseType === "blob") {
          return result.blob();
        }
        return result.json();
      })();

      return { data, statusCode: result.status };
    } catch (error) {
      return { error };
    }
  };

  post = async (
    path: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse> => {
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
  };
}
