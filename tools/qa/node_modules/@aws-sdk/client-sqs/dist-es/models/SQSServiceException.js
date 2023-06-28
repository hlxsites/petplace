import { ServiceException as __ServiceException, } from "@aws-sdk/smithy-client";
export class SQSServiceException extends __ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SQSServiceException.prototype);
    }
}
