import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Card, DisplayUncontrolledForm } from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";
import { AccountDetailsModel } from "~/domain/models/user/UserModels";
import {
  emergencyContactFormSchema,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "../form/accountForms";
import {
  buildAccountDetails,
  getAccountDetailsData,
} from "../form/formDataUtil";

type AccountDetailsTabContentProps = {
  accountDetails?: Promise<AccountDetailsModel | null>;
  isExternalLogin?: boolean;
  onSubmitAccountDetails?: (values: AccountDetailsModel) => void;
};

export const AccountDetailsTabContent = ({
  accountDetails,
  isExternalLogin,
  onSubmitAccountDetails,
}: AccountDetailsTabContentProps) => {
  const formSchema = isExternalLogin
    ? externalAccountDetailsFormSchema
    : internalAccountDetailsFormSchema;

  return (
    <div className="grid gap-xxxlarge pt-xlarge" role="region">
      <Card padding="xlarge">
        <SuspenseAwait resolve={accountDetails}>
          {(accountDetails) => (
            <DisplayUncontrolledForm
            initialValues={getAccountDetailsData(accountDetails, isExternalLogin)}
              onSubmit={({ values }) =>
                onSubmitAccountDetails?.(buildAccountDetails(values))
              }
              schema={formSchema}
              variables={{
                countryOptions: ["Canada", "United States"],
                stateOptions: [],
              }}
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
