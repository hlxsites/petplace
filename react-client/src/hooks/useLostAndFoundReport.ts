import { useSearchParams } from "react-router-dom";

const CLOSE_REPORT_PARAM = "close-report";
const LOST_PET_EXPERIENCE =
  "https://mph-qay.pethealthinc.com/external/petplacelogin?redirect=petplace/auth/report/pet";

export function useLostAndFoundReport() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isOpen = searchParams.has(CLOSE_REPORT_PARAM);

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

  function redirectToLostPet() {
    window.open(LOST_PET_EXPERIENCE);
  }

  return {
    isOpen,
    closeReportClosingModal,
    openReportClosingModal,
    redirectToLostPet,
  };
}
