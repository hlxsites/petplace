import { useSearchParams } from "react-router-dom";

const CLOSE_REPORT_PARAM = "close-report";

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

  return {
    isOpen,
    closeReportClosingModal,
    openReportClosingModal,
  };
}
