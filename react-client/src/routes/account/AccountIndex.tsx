import { Card, DisplayForm } from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";

import { DefaultLoading } from "~/components/design-system/loading/DefaultLoading";

import { useAccountIndexViewModel } from "./useAccountIndexViewModel";

export const AccountIndex = () => {
  const { accountForm, emergencyContactsForm, isSsoEnabledLogin } =
    useAccountIndexViewModel();

  return (
    <div className="grid gap-xxxlarge pt-xlarge" role="region">
      {renderAccountForm()}
      {renderEmergencyContactForm()}
      <ChangePasswordSection />
    </div>
  );

  function renderAccountForm() {
    const children = (() => {
      if (accountForm.isLoading) {
        return <DefaultLoading minHeight={400} />;
      }

      return <DisplayForm {...accountForm} />;
    })();

    return <Card padding="xlarge">{children}</Card>;
  }

  function renderEmergencyContactForm() {
    if (!isSsoEnabledLogin) return null;

    const children = (() => {
      if (emergencyContactsForm.isLoading) {
        return <DefaultLoading minHeight={400} />;
      }

      return <DisplayForm {...emergencyContactsForm} />;
    })();

    return <Card padding="xlarge">{children}</Card>;
  }
};
