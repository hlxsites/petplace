import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { OnboardingDialog } from "~/routes/my-pets/:petId/OnboardingDialog";

export const OnboardingDialogPlayground = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    searchParams.set("is-onboarding", "true");
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return <OnboardingDialog />;
};
