import { logError } from "~/infrastructure/telemetry/logUtils";
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
        body: options.body,
      });
      const statusCode = result.status;

      // No content HTTP status code
      if (result.status === 204) {
        return { data: null, statusCode };
      }

      const data: unknown = await result.json();
      return { data, statusCode };
    } catch (error) {
      return { error };
    }
  };

  postFormData = async (
    path: string,
    options: HttpFormDataOptions
  ): Promise<HttpResponse> => {
    try {
      const headers = options.headers || {};

      if (headers["Content-Type"]) {
        // Delete the content type when using FormData
        delete headers["Content-Type"];
      }

      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "POST",
        body: options.body,
        headers,
      });

      let data: unknown;
      const contentType = result.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await result.json();
      } else {
        data = await result.text();
      }

      return { data, statusCode: result.status };
    } catch (error) {
      logError("Error in POST request:", error);
      return { error };
    }
  };

  put = async (
    path: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse> => {
    try {
      const result = await fetch(`${this.baseUrl}/${path}`, {
        method: "PUT",
        headers: options.headers,
        body: options.body,
      });
      const statusCode = result.status;

      // No content HTTP status code
      if (result.status === 204) {
        return { data: null, statusCode };
      }

      const data: unknown = await result.json();
      return { data, statusCode };
    } catch (error) {
      logError("Error in PUT request:", error);
      return { error };
    }
  };
}
