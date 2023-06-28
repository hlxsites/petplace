import { Paginator } from "@aws-sdk/types";
import {
  ListQueuesCommandInput,
  ListQueuesCommandOutput,
} from "../commands/ListQueuesCommand";
import { SQSPaginationConfiguration } from "./Interfaces";
export declare function paginateListQueues(
  config: SQSPaginationConfiguration,
  input: ListQueuesCommandInput,
  ...additionalArguments: any
): Paginator<ListQueuesCommandOutput>;
