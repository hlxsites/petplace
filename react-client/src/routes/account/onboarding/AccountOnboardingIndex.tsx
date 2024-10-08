import { DefaultLoading } from "~/components/design-system/loading/DefaultLoading";
import { useAccountOnboardingViewModel } from "./useAccountOnboardingViewModel";

export const AccountOnboardingIndex = () => {
  const { isLoading } = useAccountOnboardingViewModel();

  if (!isLoading) return null;
  return <DefaultLoading minHeight={600} />;
};
