import { EndpointParameterInstructions } from "@aws-sdk/middleware-endpoint";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  Handler,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  MiddlewareStack,
} from "@aws-sdk/types";
import { UntagQueueRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClientResolvedConfig,
} from "../SQSClient";
export interface UntagQueueCommandInput extends UntagQueueRequest {}
export interface UntagQueueCommandOutput extends __MetadataBearer {}
export declare class UntagQueueCommand extends $Command<
  UntagQueueCommandInput,
  UntagQueueCommandOutput,
  SQSClientResolvedConfig
> {
  readonly input: UntagQueueCommandInput;
  static getEndpointParameterInstructions(): EndpointParameterInstructions;
  constructor(input: UntagQueueCommandInput);
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: SQSClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<UntagQueueCommandInput, UntagQueueCommandOutput>;
  private serialize;
  private deserialize;
}
