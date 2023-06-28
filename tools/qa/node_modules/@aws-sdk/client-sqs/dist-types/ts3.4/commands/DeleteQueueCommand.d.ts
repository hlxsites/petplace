import { EndpointParameterInstructions } from "@aws-sdk/middleware-endpoint";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  Handler,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  MiddlewareStack,
} from "@aws-sdk/types";
import { DeleteQueueRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClientResolvedConfig,
} from "../SQSClient";
export interface DeleteQueueCommandInput extends DeleteQueueRequest {}
export interface DeleteQueueCommandOutput extends __MetadataBearer {}
export declare class DeleteQueueCommand extends $Command<
  DeleteQueueCommandInput,
  DeleteQueueCommandOutput,
  SQSClientResolvedConfig
> {
  readonly input: DeleteQueueCommandInput;
  static getEndpointParameterInstructions(): EndpointParameterInstructions;
  constructor(input: DeleteQueueCommandInput);
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: SQSClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<DeleteQueueCommandInput, DeleteQueueCommandOutput>;
  private serialize;
  private deserialize;
}
