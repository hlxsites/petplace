import { PaginationConfiguration } from "@aws-sdk/types";
import { SQSClient } from "../SQSClient";
export interface SQSPaginationConfiguration extends PaginationConfiguration {
  client: SQSClient;
}
