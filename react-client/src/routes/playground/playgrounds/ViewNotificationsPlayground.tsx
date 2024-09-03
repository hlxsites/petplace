import { Card } from "~/components/design-system";
import { ViewNotifications } from "~/routes/account/components/ViewNotifications";

export const ViewNotificationsPlayground = () => {
  return (
    <Card>
      <div className="p-large">
        <ViewNotifications
          dateFoundOrLost={"06-10-2024"}
          foundedBy={"Erica Wong"}
          notificationCategory={"FoundPet"}
          petName={"Lily"}
        />
      </div>
    </Card>
  );
};
