import { EndpointParameterInstructions } from "@aws-sdk/middleware-endpoint";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  Handler,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  MiddlewareStack,
} from "@aws-sdk/types";
import {
  ListDeadLetterSourceQueuesRequest,
  ListDeadLetterSourceQueuesResult,
} from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClientResolvedConfig,
} from "../SQSClient";
export interface ListDeadLetterSourceQueuesCommandInput
  extends ListDeadLetterSourceQueuesRequest {}
export interface ListDeadLetterSourceQueuesCommandOutput
  extends ListDeadLetterSourceQueuesResult,
    __MetadataBearer {}
export declare class ListDeadLetterSourceQueuesCommand extends $Command<
  ListDeadLetterSourceQueuesCommandInput,
  ListDeadLetterSourceQueuesCommandOutput,
  SQSClientResolvedConfig
> {
  readonly input: ListDeadLetterSourceQueuesCommandInput;
  static getEndpointParameterInstructions(): EndpointParameterInstructions;
  constructor(input: ListDeadLetterSourceQueuesCommandInput);
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: SQSClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<
    ListDeadLetterSourceQueuesCommandInput,
    ListDeadLetterSourceQueuesCommandOutput
  >;
  private serialize;
  private deserialize;
}
