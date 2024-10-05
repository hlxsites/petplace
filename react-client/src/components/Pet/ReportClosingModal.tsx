import { useLostAndFoundReport } from "~/hooks/useLostAndFoundReport";
import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";
import { SuspenseAwait } from "../await/SuspenseAwait";
import { Dialog } from "../design-system";
import { ReportClosingModalContent } from "./ReportClosingModalContent";

export const ReportClosingModal = () => {
  const viewModel = usePetProfileContext();
  const { reportClosingReasons, closeReport } = viewModel;

  const { isOpen, closeReportClosingModal } = useLostAndFoundReport();

  return (
    <Dialog
      isOpen={isOpen}
      id="closing-report-modal"
      title="Update pet status"
      titleSize="32"
      trigger={undefined}
      padding="p-xxlarge"
    >
      <div className="pt-large md:w-[544px]">
        <SuspenseAwait resolve={reportClosingReasons}>
          {(options) => (
            <ReportClosingModalContent
              onCancel={closeReportClosingModal}
              onCloseReport={closeReport}
              options={options}
            />
          )}
        </SuspenseAwait>
      </div>
    </Dialog>
  );
};
