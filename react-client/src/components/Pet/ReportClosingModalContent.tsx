import { useState } from "react";
import { ReportClosingReasonModel } from "~/domain/models/lookup/ReportClosingReasonModel";
import { PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { Button, LinkButton, Text } from "../design-system";
import Select from "../design-system/form/Select";

type ReportClosingModalContentProps = {
  onCloseReport: (reasonId: number) => void;
  options: ReportClosingReasonModel[];
  petId: string;
};

export const ReportClosingModalContent = ({
  onCloseReport,
  options,
  petId,
}: ReportClosingModalContentProps) => {
  const [reason, setReason] = useState<string | undefined>();
  const [didSubmit, setDidSubmit] = useState(false);
  const petProfilePath = PET_PROFILE_FULL_ROUTE(petId);

  const errorMessage = (() => {
    if (!didSubmit || reason) return null;
    return "Select a reason for closing the report";
  })();

  return (
    <div className="grid gap-large pt-base">
      <Text size="16">
        Please select one of the following to close the report:
      </Text>
      <Select
        id="pet-status"
        label="Pet Status"
        required
        options={options?.map(({ reason }) => reason)}
        onChange={setReason}
        value={reason ?? ""}
        errorMessage={errorMessage}
      />
      <div className="mt-xxxxxlarge flex w-full flex-col-reverse gap-base md:flex-row">
        <LinkButton variant="secondary" to={petProfilePath} fullWidth>
          Cancel
        </LinkButton>
        <Button fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );

  function handleSubmit() {
    setDidSubmit(true);

    const selectedReason = options.find((option) => reason === option.reason);
    if (selectedReason) onCloseReport(selectedReason.id);
  }
};
