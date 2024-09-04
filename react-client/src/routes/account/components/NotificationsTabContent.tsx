import { Card, DisplayForm, Title } from "~/components/design-system";
import { notificationsFormSchema } from "../form/notificationForm";

export const NotificationsTabContent = () => {
  return (
    <div className="mt-xxxlarge grid gap-large">
      <Title level="h3">Communication Preferences</Title>
      <Card role="region">
        <div className="p-xxlarge">
          <DisplayForm
            onChange={(props) => {
              console.log("onChange values", props);

              const indexButtonElement =
                notificationsFormSchema.children.length - 1;

              // needs to make disabled
              notificationsFormSchema.children[indexButtonElement];
            }}
            onSubmit={({ event, values }) => {
              event.preventDefault();

              console.log("onSubmit values", values);
            }}
            schema={notificationsFormSchema}
          />
        </div>
      </Card>
    </div>
  );
};
