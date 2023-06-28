import { EndpointParameterInstructions } from "@aws-sdk/middleware-endpoint";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  Handler,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  MiddlewareStack,
} from "@aws-sdk/types";
import { ListQueuesRequest, ListQueuesResult } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClientResolvedConfig,
} from "../SQSClient";
export interface ListQueuesCommandInput extends ListQueuesRequest {}
export interface ListQueuesCommandOutput
  extends ListQueuesResult,
    __MetadataBearer {}
export declare class ListQueuesCommand extends $Command<
  ListQueuesCommandInput,
  ListQueuesCommandOutput,
  SQSClientResolvedConfig
> {
  readonly input: ListQueuesCommandInput;
  static getEndpointParameterInstructions(): EndpointParameterInstructions;
  constructor(input: ListQueuesCommandInput);
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: SQSClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<ListQueuesCommandInput, ListQueuesCommandOutput>;
  private serialize;
  private deserialize;
}
