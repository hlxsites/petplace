import { refreshAuthToken } from "~/util/authUtil";
import { PETPLACE_SERVER_BASE_URL } from "~/util/envUtil";
import {
  HttpClientRepository,
  HttpFormDataOptions,
  HttpOptions,
  HttpResponse,
} from "../repository/HttpClientRepository";
import { FetchHttpClientUseCase } from "./FetchHttpClientUseCase";

const REFRESH_TOKEN_PAUSE_TIME = 500;

export class PetPlaceHttpClientUseCase implements HttpClientRepository {
  private authToken: string;
  private httpClient: HttpClientRepository;

  constructor(authToken: string) {
    this.authToken = authToken;
    this.httpClient = new FetchHttpClientUseCase(PETPLACE_SERVER_BASE_URL);
  }

  private get createHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  private responseStatusMiddleware = async (
    callback: () => Promise<HttpResponse>,
    retry = 0
  ): Promise<HttpResponse> => {
    const response = await callback();

    // Handle unauthorized response
    if (response.statusCode === 401 && retry < 2) {
      // Refresh the token before trying again
      refreshAuthToken();

      // pause before trying again
      await new Promise((resolve) =>
        setTimeout(resolve, REFRESH_TOKEN_PAUSE_TIME)
      );

      return this.responseStatusMiddleware(callback, retry + 1);
    }

    return response;
  };

  delete = async (
    path: string,
    options: Omit<HttpOptions, "headers"> = {}
  ): Promise<HttpResponse> => {
    const callback = () =>
      this.httpClient.delete(path, {
        ...options,
        headers: this.createHeaders,
      });
    return this.responseStatusMiddleware(callback);
  };

  get = async (
    path: string,
    options: Omit<HttpOptions, "headers"> = {}
  ): Promise<HttpResponse> => {
    const callback = () =>
      this.httpClient.get(path, {
        ...options,
        headers: this.createHeaders,
      });

    return this.responseStatusMiddleware(callback);
  };

  post = async (
    path: string,
    options: Omit<HttpOptions, "headers"> = {}
  ): Promise<HttpResponse> => {
    const callback = () =>
      this.httpClient.post(path, {
        ...options,
        headers: this.createHeaders,
      });
    return this.responseStatusMiddleware(callback);
  };

  postFormData = async (
    path: string,
    options: Omit<HttpFormDataOptions, "headers">
  ): Promise<HttpResponse> => {
    const callback = () =>
      this.httpClient.postFormData(path, {
        ...options,
        headers: this.createHeaders,
      });
    return this.responseStatusMiddleware(callback);
  };

  put = async (
    path: string,
    options: Omit<HttpOptions, "headers"> = {}
  ): Promise<HttpResponse> => {
    return this.httpClient.put(path, {
      ...options,
      headers: this.createHeaders,
    });
  };
}
