export type HttpOptions = {
  headers?: Record<string, string>;
  responseType?: "json" | "blob";
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
  get(path: string, options?: HttpOptions): Promise<HttpResponse>;

  post(path: string, options?: HttpOptions): Promise<HttpResponse>;
}
