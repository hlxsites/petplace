export type HttpOptions = {
  headers?: Record<string, string>;
};

export type HttpResponse =
  | {
      data: unknown;
      statusCode: number;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: unknown;
    };

export interface HttpClientRepository {
  get(
    path: string,
    options?: HttpOptions,
    responseType?: "json" | "blob"
  ): Promise<HttpResponse>;

  post(path: string, options?: HttpOptions): Promise<HttpResponse>;
}
