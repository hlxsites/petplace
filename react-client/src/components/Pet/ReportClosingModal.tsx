import { cloneElement } from "react";
import { useLostAndFoundReport } from "~/hooks/useLostAndFoundReport";
import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";
import { SuspenseAwait } from "../await/SuspenseAwait";
import { Dialog, DialogTrigger } from "../design-system";
import { ReportClosingModalContent } from "./ReportClosingModalContent";

type ReportClosingModalProps = {
  trigger: DialogTrigger;
};

export const ReportClosingModal = ({ trigger }: ReportClosingModalProps) => {
  const viewModel = usePetProfileContext();
  const { reportClosingReasons, closeReport } = viewModel;

  const { isOpen, closeReportClosingModal, openReportClosingModal } =
    useLostAndFoundReport();

  const triggerElement = (() => {
    // @ts-expect-error - We know that trigger is a valid element
    return cloneElement<ReactElement<HTMLButtonElement>>(trigger, {
      onClick: openReportClosingModal,
    });
  })();

  return (
    <Dialog
      isOpen={isOpen}
      id="closing-report-modal"
      title="Update pet status"
      titleSize="32"
      trigger={triggerElement}
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
