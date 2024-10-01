import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayForm,
  DisplayUncontrolledForm,
} from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";

import { DefaultLoading } from "~/components/design-system/loading/DefaultLoading";
import {
  emergencyContactFormSchema,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "./form/accountForms";
import { useAccountIndexViewModel } from "./useAccountIndexViewModel";
import { getAccountDetailsData } from "./util/formDataUtil";

export const AccountIndex = () => {
  const {
    accountDetails,
    accountDetailsFormVariables,
    emergencyContactsFormValues,
    isDirty,
    isExternalLogin,
    isSubmitting,
    isLoading,
    onChangesEmergencyContactsFormValues,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
  } = useAccountIndexViewModel();

  const formSchema = isExternalLogin
    ? externalAccountDetailsFormSchema
    : internalAccountDetailsFormSchema;

  return (
    <div className="grid gap-xxxlarge pt-xlarge" role="region">
      <Card padding="xlarge">
        <SuspenseAwait resolve={accountDetails}>
          {(accountDetails) => (
            <DisplayUncontrolledForm
              initialValues={getAccountDetailsData(
                accountDetails,
                isExternalLogin
              )}
              onSubmit={onSubmitAccountDetails}
              schema={formSchema}
              variables={accountDetailsFormVariables}
            />
          )}
        </SuspenseAwait>
      </Card>
      {isExternalLogin && renderEmergencyContactForm()}
      <ChangePasswordSection />
    </div>
  );

  function renderEmergencyContactForm() {
    const children = (() => {
      if (isLoading.emergencyContacts)
        return <DefaultLoading minHeight={400} />;

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
