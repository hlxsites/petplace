import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Card, DisplayUncontrolledForm } from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";
import {
  emergencyContactFormSchema,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "../form/accountForms";
import { getAccountDetailsData } from "../util/formDataUtil";
import { useAccountContext } from "../useAccountIndexViewModel";

export const AccountDetailsTabContent = () => {
  const viewModel = useAccountContext();
  const { accountDetails, accountDetailsFormVariables, isExternalLogin, onSubmitAccountDetails } = viewModel;

  const formSchema = isExternalLogin
    ? externalAccountDetailsFormSchema
    : internalAccountDetailsFormSchema;

  return (
    <div className="grid gap-xxxlarge pt-xlarge" role="region">
      <Card padding="xlarge">
        <SuspenseAwait resolve={accountDetails}>
          {(accountDetails) => (
            <DisplayUncontrolledForm
              initialValues={getAccountDetailsData(accountDetails)}
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
        <DisplayUncontrolledForm
          onSubmit={({ values }) => {
            console.log("onSubmit values", values);
          }}
          schema={emergencyContactFormSchema}
        />
      </Card>
    );
  }
};
