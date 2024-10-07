import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";
import { SuspenseAwait } from "../await/SuspenseAwait";
import { Dialog } from "../design-system";
import { ReportClosingModalContent } from "./ReportClosingModalContent";

type ReportClosingModalProps = {
  petId: string;
};

export const ReportClosingModal = ({ petId }: ReportClosingModalProps) => {
  const viewModel = usePetProfileContext();
  const { reportClosingReasons, closeReport } = viewModel;
  return (
    <Dialog
      isOpen
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
              onCloseReport={closeReport}
              options={options}
              petId={petId}
            />
          )}
        </SuspenseAwait>
      </div>
    </Dialog>
  );
};
