import { useLocalStorage } from "~/hooks/useLocalStorage";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { useSteps } from "./useSteps";

type UseLocalStorageStepsProps = {
  key: string;
  totalSteps: number;
};

export const useLocalStorageSteps = ({
  key,
  totalSteps,
}: UseLocalStorageStepsProps) => {
  const [parsedStep, setStoredStep] = useLocalStorage(key, 1);
  const currentStep = Math.min(parsedStep, totalSteps);

  const setStep = (newStep: number) => {
    setStoredStep((prevStep) => {
      if (newStep > 0 && newStep <= totalSteps) {
        return newStep;
      }
      logError(
        `Invalid step: ${newStep}. Step must be between 1 and ${totalSteps}.`
      );
      return prevStep;
    });
  };

  return useSteps({
    currentStep,
    onChangeStep: setStep,
    totalSteps,
  });
};
