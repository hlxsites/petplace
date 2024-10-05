import { useSearchParams } from "react-router-dom";
import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";

const CLOSE_REPORT_PARAM = "close-report";

export function useLostAndFoundReport() {
  const {
    pet,
    isSubmittingFoundPetReport,
    reportClosingReasons,
    submitPetFoundReport,
  } = usePetProfileContext();

  // TODO: this hook should be moved to a specialized view model

  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen =
    pet?.missingStatus === "missing" && searchParams.has(CLOSE_REPORT_PARAM);

  function openReportClosingModal() {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.set(CLOSE_REPORT_PARAM, "true");
      return nextSearchParams;
    });
  }

  function closeReportClosingModal() {
    setSearchParams(
      (nextSearchParams) => {
        nextSearchParams.delete(CLOSE_REPORT_PARAM);
        return nextSearchParams;
      },
      {
        replace: true,
      }
    );
  }

  return {
    closeReportClosingModal,
    isOpen,
    isSubmittingFoundPetReport,
    openReportClosingModal,
    reportClosingReasons,
    submitPetFoundReport,
  };
}
