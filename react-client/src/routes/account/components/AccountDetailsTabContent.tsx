import { Card, DisplayForm } from "~/components/design-system";
import { ChangePasswordSection } from "~/components/MyAccount/sections/ChangePasswordSection";
import {
  emergencyContactFormSchema,
  externalAccountDetailsFormSchema,
  internalAccountDetailsFormSchema,
} from "../form/accountForms";

export const AccountDetailsTabContent = () => {
  const isExternalAccess = true;

  const formSchema = isExternalAccess
    ? externalAccountDetailsFormSchema
    : internalAccountDetailsFormSchema;

  return (
    <div className="grid gap-xxxlarge pt-xlarge" role="region">
      <Card padding="xlarge">
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
        />
      </Card>
      {isExternalAccess && renderEmergencyContactForm()}
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