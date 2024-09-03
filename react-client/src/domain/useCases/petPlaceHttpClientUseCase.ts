import { PETPLACE_SERVER_BASE_URL } from "~/util/envUtil";
import {
  HttpClientRepository,
  HttpOptions,
  HttpResponse,
} from "../repository/HttpClientRepository";
import { fetchHttpClientUseCase } from "./fetchHttpClientUseCase";

export class petPlaceHttpClientUseCase implements HttpClientRepository {
  private authToken: string;
  private httpClient: HttpClientRepository;

  constructor(authToken: string) {
    this.authToken = authToken;
    this.httpClient = new fetchHttpClientUseCase(PETPLACE_SERVER_BASE_URL);
  }

  private get createHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.authToken}`,
    };
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
}
