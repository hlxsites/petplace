import { logError } from "~/infrastructure/telemetry/logUtils";
import {
  HttpClientRepository,
  HttpFormDataOptions,
  HttpOptions,
  HttpResponse,
} from "../repository/HttpClientRepository";

export class FetchHttpClientUseCase implements HttpClientRepository {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  delete = async (
    path: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse> => {
    return fetchMiddleware(`${this.baseUrl}/${path}`, {
      method: "DELETE",
      headers: options.headers,
    });
  };

  get = async (
    path: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse> => {
    return fetchMiddleware(`${this.baseUrl}/${path}`, {
      method: "GET",
      headers: options.headers,
      isBlobRequest: options.responseType === "blob",
    });
  };

  post = async (
    path: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse> => {
    return fetchMiddleware(`${this.baseUrl}/${path}`, {
      method: "POST",
      headers: options.headers,
      body: options.body,
    });
  };

  postFormData = async (
    path: string,
    options: HttpFormDataOptions
  ): Promise<HttpResponse> => {
    const headers = options.headers || {};

    if (headers["Content-Type"]) {
      // Delete the content type when using FormData
      delete headers["Content-Type"];
    }

    return fetchMiddleware(`${this.baseUrl}/${path}`, {
      body: options.body,
      headers,
      isBlobRequest: options.responseType === "blob",
      method: "POST",
    });
  };

  put = async (
    path: string,
    options: HttpOptions = {}
  ): Promise<HttpResponse> => {
    return fetchMiddleware(`${this.baseUrl}/${path}`, {
      method: "PUT",
      headers: options.headers,
      body: options.body,
    });
  };
}

async function fetchMiddleware(
  url: string,
  options?: RequestInit & {
    isBlobRequest?: boolean;
  }
): Promise<HttpResponse> {
  try {
    const { isBlobRequest, ...rest } = options || {};

    const response = await fetch(url, rest);
    const contentType = response.headers.get("Content-Type");

    const data: unknown = await (async () => {
      // No content HTTP status code
      if (response.status === 204) return null;

      if (isBlobRequest) return response.blob();

      // Check if the response is json
      if (contentType?.includes("application/json")) {
        return response.json();
      }
      return response.text();
    })();

    return { data, statusCode: response.status };
  } catch (error) {
    logError("Fetch request error:", error);
    return { error };
  }
}
