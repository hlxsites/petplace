import { useSearchParams } from "react-router-dom";

const CLOSE_REPORT_PARAM = "close-report";
const LOST_PET_EXPERIENCE =
  "https://mph-qay.pethealthinc.com/external/petplacelogin?redirect=petplace/auth/report/pet";

export function useLostAndFoundReport() {
  const [searchParams, setSearchParams] = useSearchParams();

  function openReportClosingModal() {
    searchParams.set(CLOSE_REPORT_PARAM, "true");
    setSearchParams(searchParams);
  }

  function closeReportClosingModal() {
    searchParams.delete(CLOSE_REPORT_PARAM);
    setSearchParams(searchParams);
  }

  function redirectToLostPet() {
    window.open(LOST_PET_EXPERIENCE);
  }

  return {
    openReportClosingModal,
    closeReportClosingModal,
    redirectToLostPet,
  };
}
