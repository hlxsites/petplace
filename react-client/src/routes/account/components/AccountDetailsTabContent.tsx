import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  FormValues,
} from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";
import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
} from "~/domain/models/user/UserModels";
import {
  emergencyContactFormSchema,
  emergencyContactIds,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "../form/accountForms";
import {
  buildAccountDetails,
  buildAccountEmergencyContactsList,
  convertToAccountEmergencyContactModel,
  getAccountDetailsData,
  getAccountEmergencyContactsData,
} from "../form/formDataUtil";

type AccountDetailsTabContentProps = {
  accountDetails?: Promise<AccountDetailsModel | null>;
  emergencyContacts?: Promise<AccountEmergencyContactModel[] | null>;
  isExternalLogin?: boolean;
  onDeleteEmergencyContact?: (data: AccountEmergencyContactModel) => void;
  onSubmitEmergencyContacts?: (data: AccountEmergencyContactModel[]) => void;
  onSubmitAccountDetails?: (values: AccountDetailsModel) => void;
};

export const AccountDetailsTabContent = ({
  accountDetails,
  emergencyContacts,
  isExternalLogin,
  onDeleteEmergencyContact,
  onSubmitEmergencyContacts,
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
              initialValues={getAccountDetailsData(
                accountDetails,
                isExternalLogin
              )}
              onSubmit={({ values }) =>
                onSubmitAccountDetails?.(
                  buildAccountDetails(values, isExternalLogin)
                )
              }
              schema={formSchema}
              variables={{
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
                onSubmitEmergencyContacts?.(
                  buildAccountEmergencyContactsList(
                    values[
                      emergencyContactIds.repeaterId
                    ] as unknown as FormValues[]
                  )
                );
              }}
              onDeleteRepeater={(contact) =>
                onDeleteEmergencyContact?.(
                  convertToAccountEmergencyContactModel(contact)
                )
              }
              schema={emergencyContactFormSchema}
              initialValues={getAccountEmergencyContactsData(emergencyContacts)}
            />
          )}
        </SuspenseAwait>
      </Card>
    );
  }
};
