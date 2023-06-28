import { EndpointParameterInstructions } from "@aws-sdk/middleware-endpoint";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  Handler,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  MiddlewareStack,
} from "@aws-sdk/types";
import { PurgeQueueRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClientResolvedConfig,
} from "../SQSClient";
export interface PurgeQueueCommandInput extends PurgeQueueRequest {}
export interface PurgeQueueCommandOutput extends __MetadataBearer {}
export declare class PurgeQueueCommand extends $Command<
  PurgeQueueCommandInput,
  PurgeQueueCommandOutput,
  SQSClientResolvedConfig
> {
  readonly input: PurgeQueueCommandInput;
  static getEndpointParameterInstructions(): EndpointParameterInstructions;
  constructor(input: PurgeQueueCommandInput);
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: SQSClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<PurgeQueueCommandInput, PurgeQueueCommandOutput>;
  private serialize;
  private deserialize;
}
