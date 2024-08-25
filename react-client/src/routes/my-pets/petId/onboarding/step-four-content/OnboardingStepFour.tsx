import { CommonOnboardingProps } from "../OnboardingDialog";
import { ApprovedStatusContent } from "./ApprovedStatusContent";
import { FailedStatusContent } from "./FailedStatusContent";
import { InProgressStatusContent } from "./InProgressStatusContent";
import { NoneStatusContent } from "./NoneStatusContent";
import { SentStatusContent } from "./SentStatusContent";

export const OnboardingStepFour = ({
  name,
  ...rest
}: CommonOnboardingProps & { name?: string }) => {
  return {
    none: <NoneStatusContent {...rest} name={name} />,
    sent: <SentStatusContent {...rest} />,
    approved: <ApprovedStatusContent {...rest} />,
    failed: <FailedStatusContent {...rest} />,
    inProgress: <InProgressStatusContent {...rest} />,
  }[rest.status];
};
