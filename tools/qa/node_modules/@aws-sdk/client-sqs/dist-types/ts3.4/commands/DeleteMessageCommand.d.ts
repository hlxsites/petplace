import { EndpointParameterInstructions } from "@aws-sdk/middleware-endpoint";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  Handler,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  MiddlewareStack,
} from "@aws-sdk/types";
import { DeleteMessageRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClientResolvedConfig,
} from "../SQSClient";
export interface DeleteMessageCommandInput extends DeleteMessageRequest {}
export interface DeleteMessageCommandOutput extends __MetadataBearer {}
export declare class DeleteMessageCommand extends $Command<
  DeleteMessageCommandInput,
  DeleteMessageCommandOutput,
  SQSClientResolvedConfig
> {
  readonly input: DeleteMessageCommandInput;
  static getEndpointParameterInstructions(): EndpointParameterInstructions;
  constructor(input: DeleteMessageCommandInput);
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: SQSClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<DeleteMessageCommandInput, DeleteMessageCommandOutput>;
  private serialize;
  private deserialize;
}
