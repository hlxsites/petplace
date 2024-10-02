import { Card, DisplayForm } from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";

import { DefaultLoading } from "~/components/design-system/loading/DefaultLoading";
import {
  emergencyContactFormSchema,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "./form/accountForms";
import { useAccountIndexViewModel } from "./useAccountIndexViewModel";

export const AccountIndex = () => {
  const {
    accountFormValues,
    accountDetailsFormVariables,
    emergencyContactsFormValues,
    isDirty,
    isExternalLogin,
    isSubmitting,
    isLoading,
    onChangesAccountFormValues,
    onChangesEmergencyContactsFormValues,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
  } = useAccountIndexViewModel();

  const formSchema = isExternalLogin
    ? externalAccountDetailsFormSchema
    : internalAccountDetailsFormSchema;

  return (
    <div className="grid gap-xxxlarge pt-xlarge" role="region">
      <Card padding="xlarge">{renderAccountForm()}</Card>
      {isExternalLogin && renderEmergencyContactForm()}
      <ChangePasswordSection />
    </div>
  );

  function renderAccountForm() {
    const children = (() => {
      if (isLoading.account) return <DefaultLoading minHeight={800} />;

      return (
        <DisplayForm
          isDirty={isDirty.account}
          isSubmitting={isSubmitting.account}
          onChange={onChangesAccountFormValues}
          onSubmit={onSubmitAccountDetails}
          schema={formSchema}
          variables={accountDetailsFormVariables}
          values={accountFormValues}
        />
      );
    })();

    return <Card padding="xlarge">{children}</Card>;
  }

  function renderEmergencyContactForm() {
    const children = (() => {
      if (isLoading.emergencyContacts)
        return <DefaultLoading minHeight={500} />;

      return (
        <DisplayForm
          isDirty={isDirty.emergencyContacts}
          isSubmitting={isSubmitting.emergencyContacts}
          onChange={onChangesEmergencyContactsFormValues}
          onSubmit={onSubmitEmergencyContacts}
          schema={emergencyContactFormSchema}
          values={emergencyContactsFormValues}
        />
      );
    })();

    return <Card padding="xlarge">{children}</Card>;
  }
};
