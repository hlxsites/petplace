import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Card, DisplayForm } from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";
import { AccountDetailsModel } from "~/domain/models/user/UserModels";
import {
  emergencyContactFormSchema,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "../form/accountForms";
import { getAccountDetailsData } from "./util/formDataUtil";

type AccountDetailsTabContentProps = {
  accountDetails?: Promise<AccountDetailsModel | null>;
  isExternalLogin?: boolean;
};

export const AccountDetailsTabContent = ({
  accountDetails,
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
            <DisplayForm
              onChange={(props) => {
                console.log("onChange values", props);
              }}
              onSubmit={({ event, values }) => {
                event.preventDefault();
                console.log("onSubmit values", values);
              }}
              schema={formSchema}
              variables={{
                countryOptions: ["Canada", "United States"],
                stateOptions: [],
              }}
              values={getAccountDetailsData(accountDetails)}
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
        <DisplayForm
          onChange={(props) => {
            console.log("onChange values", props);
          }}
          onSubmit={({ event, values }) => {
            event.preventDefault();
            console.log("onSubmit values", values);
          }}
          schema={emergencyContactFormSchema}
        />
      </Card>
    );
  }
};
