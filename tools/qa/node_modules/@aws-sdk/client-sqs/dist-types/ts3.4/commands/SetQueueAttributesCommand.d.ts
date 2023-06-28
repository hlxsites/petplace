import { EndpointParameterInstructions } from "@aws-sdk/middleware-endpoint";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  Handler,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  MiddlewareStack,
} from "@aws-sdk/types";
import { SetQueueAttributesRequest } from "../models/models_0";
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  SQSClientResolvedConfig,
} from "../SQSClient";
export interface SetQueueAttributesCommandInput
  extends SetQueueAttributesRequest {}
export interface SetQueueAttributesCommandOutput extends __MetadataBearer {}
export declare class SetQueueAttributesCommand extends $Command<
  SetQueueAttributesCommandInput,
  SetQueueAttributesCommandOutput,
  SQSClientResolvedConfig
> {
  readonly input: SetQueueAttributesCommandInput;
  static getEndpointParameterInstructions(): EndpointParameterInstructions;
  constructor(input: SetQueueAttributesCommandInput);
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: SQSClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<SetQueueAttributesCommandInput, SetQueueAttributesCommandOutput>;
  private serialize;
  private deserialize;
}
