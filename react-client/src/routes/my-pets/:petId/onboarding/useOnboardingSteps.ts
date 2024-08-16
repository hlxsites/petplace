import { useLocalStorage } from "~/hooks/useLocalStorage";

const STEP_PARAM_KEY = "step";
const COUNT = 5;

type OnboardingStepsReturn = {
  step: number;
  setStep: (newStep: number) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
};

export const useOnboardingSteps = (): OnboardingStepsReturn => {
  const [parsedStep, setStoredStep] = useLocalStorage(STEP_PARAM_KEY, 1);

  const step = Math.min(parsedStep, COUNT);

  const setStep = (newStep: number) => {
    setStoredStep((prevStep) => {
      if (newStep > 0 && newStep <= COUNT) {
        return newStep;
      }
      console.error(
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
    totalSteps: COUNT,
  };
};
