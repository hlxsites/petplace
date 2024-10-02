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
  const [reason, setReason] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);
  const petProfilePath = PET_PROFILE_FULL_ROUTE(petId);

  return (
    <div className="pt-base grid gap-large">
      <Text size="16">
        Please select one of the following to close the report:
      </Text>
      <Select
        id="pet-status"
        label="Pet Status"
        required
        options={options.map(({ reason }) => reason)}
        onChange={handleChange}
        value={reason}
        errorMessage={
          didSubmit && !reason
            ? "Select a reason for closing the report"
            : undefined
        }
      />
      <div className="mt-xxxxxlarge flex w-full gap-base flex-col-reverse md:flex-row">
        <LinkButton variant="secondary" to={petProfilePath} fullWidth>
          Cancel
        </LinkButton>
        <Button fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );

  function handleChange(newValue: string) {
    setReason(newValue);
  }

  function handleSubmit() {
    setDidSubmit(true);
    if (reason)
      onCloseReport(
        options.find((option) => reason === option.reason)!.id
      );
  }
};
