import { EndpointParameterInstructions } from "@aws-sdk/middleware-endpoint";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  Handler,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  MiddlewareStack,
} from "@aws-sdk/types";
import { SendMessageRequest, SendMessageResult } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClientResolvedConfig,
} from "../SQSClient";
export interface SendMessageCommandInput extends SendMessageRequest {}
export interface SendMessageCommandOutput
  extends SendMessageResult,
    __MetadataBearer {}
export declare class SendMessageCommand extends $Command<
  SendMessageCommandInput,
  SendMessageCommandOutput,
  SQSClientResolvedConfig
> {
  readonly input: SendMessageCommandInput;
  static getEndpointParameterInstructions(): EndpointParameterInstructions;
  constructor(input: SendMessageCommandInput);
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: SQSClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<SendMessageCommandInput, SendMessageCommandOutput>;
  private serialize;
  private deserialize;
}
