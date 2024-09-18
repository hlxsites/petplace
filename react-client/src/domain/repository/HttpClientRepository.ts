export type HttpOptions = {
  headers?: Record<string, string>;
  responseType?: "json" | "blob";
  body?: BodyInit | null;
};

export type HttpFormDataOptions = Omit<HttpOptions, "body"> & {
  body: FormData;
};

export type HttpResponse =
  | {
      data: unknown;
      statusCode: number;
      error?: undefined;
    }
  | {
      data?: undefined;
      statusCode?: undefined;
      error: unknown;
    };

export interface HttpClientRepository {
  delete(path: string, options?: HttpOptions): Promise<HttpResponse>;

  get(path: string, options?: HttpOptions): Promise<HttpResponse>;

  post(path: string, options?: HttpOptions): Promise<HttpResponse>;

  postFormData(
    path: string,
    options: HttpFormDataOptions
  ): Promise<HttpResponse>;
}
