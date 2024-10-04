import { useState } from "react";
import { ReportClosingReasonModel } from "~/domain/models/lookup/ReportClosingReasonModel";
import { useLostAndFoundReport } from "~/hooks/useLostAndFoundReport";
import { Button, Text } from "../design-system";
import Select from "../design-system/form/Select";

type ReportClosingModalContentProps = {
  onCloseReport: (reasonId: number) => void;
  options: ReportClosingReasonModel[];
  petId: string;
};

export const ReportClosingModalContent = ({
  onCloseReport,
  options,
}: ReportClosingModalContentProps) => {
  const [reason, setReason] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);
  const { closeReportClosingModal } = useLostAndFoundReport();

  return (
    <div className="grid gap-large pt-base">
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
      <div className="mt-xxxxxlarge flex w-full flex-col-reverse gap-base md:flex-row">
        <Button variant="secondary" onClick={closeReportClosingModal} fullWidth>
          Cancel
        </Button>
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
    if (reason.length)
      onCloseReport(options.find((option) => reason === option.reason)!.id);
  }
};
