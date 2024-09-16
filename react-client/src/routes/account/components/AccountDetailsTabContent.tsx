import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  FormValues,
} from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";
import { AccountDetailsModel } from "~/domain/models/user/UserModels";
import { readJwtClaim } from "~/util/authUtil";
import {
  emergencyContactFormSchema,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "../form/accountForms";

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
        <DisplayUncontrolledForm
          onSubmit={({ values }) => {
            console.log("onSubmit values", values);
          }}
          schema={emergencyContactFormSchema}
        />
      </Card>
    );
  }

  function getAccountDetailsData(
    accountDetails?: AccountDetailsModel | null
  ): FormValues {
    const data = readJwtClaim();
    return {
      "first-name": data?.given_name ?? "",
      "last-name": data?.family_name ?? "",
      "email-address": data?.emails[0] ?? "",
      "phone-default": accountDetails?.phoneNumber ?? "",
    };
  }
};
