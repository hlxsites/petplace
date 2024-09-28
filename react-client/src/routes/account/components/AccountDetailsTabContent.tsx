import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  FormValues,
} from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";

import {
  emergencyContactFormSchema,
  emergencyContactIds,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "../form/accountForms";
import { useAccountContext } from "../useAccountIndexViewModel";
import {
  buildAccountEmergencyContactsList,
  getAccountDetailsData,
  getAccountEmergencyContactsData,
} from "../util/formDataUtil";

export const AccountDetailsTabContent = () => {
  const {
    accountDetails,
    accountDetailsFormVariables,
    emergencyContacts,
    isExternalLogin,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
  } = useAccountContext();

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
              onSubmit={({ values }) => onSubmitAccountDetails(values)}
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
    return (
      <Card padding="xlarge">
        <SuspenseAwait resolve={emergencyContacts}>
          {(emergencyContacts) => (
            <DisplayUncontrolledForm
              onSubmit={({ event, values }) => {
                event.preventDefault();
                onSubmitEmergencyContacts?.(
                  buildAccountEmergencyContactsList(
                    values[
                      emergencyContactIds.repeaterId
                    ] as unknown as FormValues[]
                  )
                );
              }}
              schema={emergencyContactFormSchema}
              initialValues={getAccountEmergencyContactsData(emergencyContacts)}
            />
          )}
        </SuspenseAwait>
      </Card>
    );
  }
};
