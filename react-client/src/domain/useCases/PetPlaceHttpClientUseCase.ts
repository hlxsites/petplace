import { PETPLACE_SERVER_BASE_URL } from "~/util/envUtil";
import {
  HttpClientRepository,
  HttpFormDataOptions,
  HttpOptions,
  HttpResponse,
} from "../repository/HttpClientRepository";
import { FetchHttpClientUseCase } from "./FetchHttpClientUseCase";

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

  async delete(
    path: string,
    options: Omit<HttpOptions, "headers"> = {}
  ): Promise<HttpResponse> {
    return this.httpClient.delete(path, {
      ...options,
      headers: this.createHeaders,
    });
  }

  async get(
    path: string,
    options: Omit<HttpOptions, "headers"> = {}
  ): Promise<HttpResponse> {
    return this.httpClient.get(path, {
      ...options,
      headers: this.createHeaders,
    });
  }

  async post(
    path: string,
    options: Omit<HttpOptions, "headers"> = {}
  ): Promise<HttpResponse> {
    return this.httpClient.post(path, {
      ...options,
      headers: this.createHeaders,
    });
  }

  async postFormData(
    path: string,
    options: Omit<HttpFormDataOptions, "headers">
  ): Promise<HttpResponse> {
    return this.httpClient.postFormData(path, {
      ...options,
      headers: this.createHeaders,
    });
  }
}
