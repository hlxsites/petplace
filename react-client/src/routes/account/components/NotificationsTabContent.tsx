import { Card, DisplayForm, Title } from "~/components/design-system";
import { notificationsFormSchema } from "../form/notificationForm";
import {
  LostAndFoundNotifications,
  LostNotification,
} from "./LostAndFoundNotifications";

type NotificationsTabProps = {
  isExternalLogin?: boolean;
  lostPetsHistory?: LostNotification[];
};

export const NotificationsTabContent = ({
  isExternalLogin,
  lostPetsHistory,
}: NotificationsTabProps) => {
  return (
    <div className="mt-xxxlarge grid gap-large">
      <Title level="h3">Communication Preferences</Title>
      <Card role="region">
        <div className="p-xxlarge">
          <DisplayForm
            onChange={(props) => {
              console.log("onChange values", props);
            }}
            onSubmit={({ event, values }) => {
              event.preventDefault();

              console.log("onSubmit values", values);
            }}
            schema={notificationsFormSchema}
          />
        </div>
      </Card>
      {isExternalLogin && (
        <LostAndFoundNotifications notifications={lostPetsHistory} />
      )}
    </div>
  );
};
