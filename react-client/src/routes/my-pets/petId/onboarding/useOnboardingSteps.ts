import { useLocalStorage } from "~/hooks/useLocalStorage";
import { logError } from "~/infrastructure/telemetry/logUtils";

const STEP_PARAM_KEY = "step";
const COUNT = 5;

export const useOnboardingSteps = () => {
  const [parsedStep, setStoredStep, reset] = useLocalStorage(STEP_PARAM_KEY, 1);

  const step = Math.min(parsedStep, COUNT);

  const setStep = (newStep: number) => {
    setStoredStep((prevStep) => {
      if (newStep > 0 && newStep <= COUNT) {
        return newStep;
      }
      logError(
        `Invalid step: ${newStep}. Step must be between 1 and ${COUNT}.`
      );
      return prevStep;
    });
  };

  const onNextStep = () => {
    setStep(step + 1);
  };

  const onPrevStep = () => {
    setStep(step - 1);
  };

  return {
    step,
    setStep,
    onNextStep,
    onPrevStep,
    isFirstStep: step === 1,
    isLastStep: step === COUNT,
    reset,
    totalSteps: COUNT,
  };
};
