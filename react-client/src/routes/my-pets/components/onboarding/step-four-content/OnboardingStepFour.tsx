import { DocumentationStatus } from "~/domain/models/pet/PetModel";
import { CommonOnboardingProps } from "../OnboardingDialog";
import { ApprovedStatusContent } from "./ApprovedStatusContent";
import { FailedStatusContent } from "./FailedStatusContent";
import { InProgressStatusContent } from "./InProgressStatusContent";
import { NoneStatusContent } from "./NoneStatusContent";
import { SentStatusContent } from "./SentStatusContent";

type OnboardingStepFourProps = CommonOnboardingProps & {
  name?: string;
  onSubmitConsent: (consent: boolean) => void;
  status: DocumentationStatus;
};

export const OnboardingStepFour = ({
  name,
  onSubmitConsent,
  status,
  ...rest
}: OnboardingStepFourProps) => {
  return {
    none: (
      <NoneStatusContent
        {...rest}
        name={name}
        onSubmitConsent={onSubmitConsent}
      />
    ),
    sent: <SentStatusContent {...rest} />,
    approved: <ApprovedStatusContent {...rest} />,
    failed: <FailedStatusContent {...rest} />,
    inProgress: <InProgressStatusContent {...rest} />,
  }[status];
};
