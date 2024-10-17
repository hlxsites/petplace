import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReportClosingReasonModel } from "~/domain/models/lookup/ReportClosingReasonModel";
import { PetModel } from "~/domain/models/pet/PetModel";
import { ReportPetFoundMutationInput } from "~/domain/models/pet/ReportClosingModel";

const CLOSE_REPORT_PARAM = "close-report";

type UseLostAndFoundReportProps = {
  fetchLostPetHistory: () => Promise<void>;
  mutateReport: (props: ReportPetFoundMutationInput) => Promise<boolean>;
  pet: Pick<PetModel, "id" | "microchip" | "missingStatus"> | null;
  reportClosingReasons: Promise<ReportClosingReasonModel[]>;
};

export const useLostAndFoundReportViewModel = ({
  fetchLostPetHistory,
  mutateReport,
  pet,
  reportClosingReasons,
}: UseLostAndFoundReportProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen =
    pet?.missingStatus === "missing" && searchParams.has(CLOSE_REPORT_PARAM);

  const onClickReportPetFound = () => {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.set(CLOSE_REPORT_PARAM, "true");
      return nextSearchParams;
    });
  };

  const closeReportClosingModal = () => {
    setSearchParams(
      (nextSearchParams) => {
        nextSearchParams.delete(CLOSE_REPORT_PARAM);
        return nextSearchParams;
      },
      {
        replace: true,
      }
    );
  };

  const submitPetFoundReport = (reason: number) => {
    if (!pet) return;

    setIsSubmitting(true);

    void (async () => {
      const microchip = pet?.microchip ?? "";
      await mutateReport({ petId: pet.id, microchip, reason });
      await fetchLostPetHistory();

      closeReportClosingModal();
      setIsSubmitting(false);
    })();
  };

  return {
    closeReportClosingModal,
    isOpen,
    isSubmitting,
    onClickReportPetFound,
    reportClosingReasons,
    submitPetFoundReport,
  };
};
