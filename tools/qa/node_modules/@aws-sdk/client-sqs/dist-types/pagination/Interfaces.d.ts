import { PaginationConfiguration } from "@aws-sdk/types";
import { SQSClient } from "../SQSClient";
/**
 * @public
 */
export interface SQSPaginationConfiguration extends PaginationConfiguration {
    client: SQSClient;
}
