import { useState } from "react";
import { ReportClosingReasonModel } from "~/domain/models/lookup/ReportClosingReasonModel";
import { Button, Text } from "../design-system";
import Select from "../design-system/form/Select";

type ReportClosingModalContentProps = {
  onCancel: () => void;
  onCloseReport: (reasonId: number) => void;
  options: ReportClosingReasonModel[];
};

export const ReportClosingModalContent = ({
  onCancel,
  onCloseReport,
  options,
}: ReportClosingModalContentProps) => {
  const [reason, setReason] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);

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
        value={reason}
        errorMessage={errorMessage}
      />
      <div className="mt-xxxxxlarge flex w-full flex-col-reverse gap-base md:flex-row">
        <Button fullWidth onClick={onCancel} variant="secondary">
          Cancel
        </Button>
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
