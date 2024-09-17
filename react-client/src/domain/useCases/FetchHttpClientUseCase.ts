import {
  HttpClientRepository,
  HttpFormDataOptions,
  HttpOptions,
  HttpResponse,
} from "../repository/HttpClientRepository";

export class FetchHttpClientUseCase implements HttpClientRepository {
  private baseUrl: string;

  constructor(defaultUrl: string) {
    const baseUrl = defaultUrl.replace(/\/api$/, "");
    this.baseUrl = baseUrl;
  }

  async delete(path: string, options: HttpOptions = {}): Promise<HttpResponse> {
    try {
      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "DELETE",
        headers: options.headers,
      });

      return { data: true, statusCode: result.status };
    } catch (error) {
      return { error };
    }
  }

  async get(path: string, options: HttpOptions = {}): Promise<HttpResponse> {
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

  async postFormData(
    path: string,
    options: HttpFormDataOptions
  ): Promise<HttpResponse> {
    try {
      const headers = options.headers || {};

      if (options.body instanceof FormData) {
        delete headers["Content-Type"];
      } else if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "POST",
        body: options.body,
        headers: headers,
      });

      let data: unknown;
      const contentType = result.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await result.json();
      } else {
        data = await result.text();
      }

      return { data, statusCode: result.status };
    } catch (error) {
      console.error("Error in POST request:", error);
      return { error };
    }
  }
}
