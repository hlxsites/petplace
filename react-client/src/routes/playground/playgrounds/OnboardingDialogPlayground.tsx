import { useState } from "react";
import { Button } from "~/components/design-system";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { OnboardingDialog } from "~/routes/my-pets/:petId/onboarding/OnboardingDialog";

export const OnboardingDialogPlayground = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, , remove] = useLocalStorage("step", 1);

  return (
    <div className="flex justify-center">
      <Button
        onClick={() => {
          remove();
          setIsOpen(true);
        }}
      >
        Open onboarding dialog
      </Button>
      {!!isOpen && <OnboardingDialog />}
    </div>
  );
};
