import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
} from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";
import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
} from "~/domain/models/user/UserModels";
import {
  emergencyContactFormSchema,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "../form/accountForms";
import {
  getAccountDetailsData,
  getAccountEmergencyContactsData,
} from "../form/formDataUtil";

type AccountDetailsTabContentProps = {
  accountDetails?: Promise<AccountDetailsModel | null>;
  emergencyContacts?: Promise<AccountEmergencyContactModel[] | null>;
  isExternalLogin?: boolean;
};

export const AccountDetailsTabContent = ({
  accountDetails,
  emergencyContacts,
  isExternalLogin,
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
              initialValues={getAccountDetailsData(accountDetails)}
              onSubmit={({ values }) => {
                console.log("onSubmit values", values);
              }}
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
        <SuspenseAwait resolve={emergencyContacts}>
          {(emergencyContacts) => (
            <DisplayUncontrolledForm
              onSubmit={({ event, values }) => {
                event.preventDefault();
                console.log("onSubmit values", values);
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
