import { Card, Checkbox, Title } from "~/components/design-system";
import { LostPetUpdate } from "~/domain/models/pet/PetModel";
import { ViewNotifications } from "./ViewNotifications";

export type LostNotification = {
  petHistory?: LostPetUpdate[];
  petName: string;
};

export type LostAndFoundNotificationsProps = {
  notifications?: LostNotification[];
};

export const LostAndFoundNotifications = ({
  notifications,
}: LostAndFoundNotificationsProps) => {
  const checkboxesFilters = [
    {
      label: "All",
    },
    {
      label: "Incoming found pet alerts",
    },
  ];

  const notificationsLength = notifications?.length;

  return (
    <Card>
      <div className="p-xxlarge">
        <div className="flex items-center justify-between pb-large">
          <Title level="h3">Lost & Found notifications</Title>
          <div className="flex gap-large">
            {checkboxesFilters.map(({ label }) => (
              <Checkbox id={label} key={label} label={label} variant="purple" />
            ))}
          </div>
        </div>

        {notificationsLength && (
          <Card>
            <div className="p-large">
              {notifications.map((notification, index) =>
                notification.petHistory?.map(({ date, foundedBy }) => (
                  <div key={`${notification.petName}-${index}`}>
                    <ViewNotifications
                      dateFoundOrLost={date}
                      foundedBy={foundedBy?.finderName}
                      petName={notification.petName}
                    />
                    {renderHorizontalDivider(index + 1)}
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );

  function renderHorizontalDivider(index: number) {
    if (notificationsLength === index) return null;
    return <hr className="-mx-[10%] border-neutral-300" />;
  }
};
