import { Paginator } from "@aws-sdk/types";
import {
  ListDeadLetterSourceQueuesCommandInput,
  ListDeadLetterSourceQueuesCommandOutput,
} from "../commands/ListDeadLetterSourceQueuesCommand";
import { SQSPaginationConfiguration } from "./Interfaces";
export declare function paginateListDeadLetterSourceQueues(
  config: SQSPaginationConfiguration,
  input: ListDeadLetterSourceQueuesCommandInput,
  ...additionalArguments: any
): Paginator<ListDeadLetterSourceQueuesCommandOutput>;
