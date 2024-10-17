type UseStepsProps = {
  currentStep: number;
  onChangeStep: (newStep: number) => void;
  totalSteps: number;
};

export const useSteps = ({
  currentStep,
  onChangeStep,
  totalSteps,
}: UseStepsProps) => {
  const onNextStep = () => {
    onChangeStep(currentStep + 1);
  };

  const onPrevStep = () => {
    onChangeStep(currentStep - 1);
  };

  const reset = () => {
    onChangeStep(1);
  };

  return {
    currentStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    onNextStep,
    onPrevStep,
    reset,
  };
};
