import { Card, Checkbox, Title } from "~/components/design-system";
import { LostPetUpdate } from "~/domain/models/pet/PetModel";
import { ViewNotifications } from "./ViewNotifications";

import { Fragment, useState } from "react";
import { NotificationsDialog } from "./NotificationsDialog";

export type LostNotification = {
  petHistory?: LostPetUpdate[];
  petName: string;
};

export type LostAndFoundNotificationsProps = {
  notifications?: LostNotification[];
};

export const LostAndFoundNotifications = ({
  notifications = [],
}: LostAndFoundNotificationsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<LostNotification | null>(null);

  const checkboxesFilters = [
    { label: "All" },
    { label: "Incoming found pet alerts" },
  ];

  return (
    <>
      <Card>
        <div className="p-xxlarge">
          <div className="flex items-center justify-between pb-large">
            <Title level="h3">Lost & Found notifications</Title>
            <div className="flex gap-large">
              {renderCheckboxes(checkboxesFilters)}
            </div>
          </div>

          {notifications.length > 0 && (
            <Card>
              <div className="p-large">
                {notifications.map((notification, index) =>
                  renderNotification(notification, index)
                )}
              </div>
            </Card>
          )}
        </div>
      </Card>

      {selectedPet && (
        <NotificationsDialog
          isOpen={isOpen}
          onClose={onCloseDialog}
          viewData={selectedPet.petHistory}
          petName={selectedPet.petName}
        />
      )}
    </>
  );

  function renderCheckboxes(checkboxes: { label: string }[]) {
    return checkboxes.map(({ label }) => (
      <Checkbox id={label} key={label} label={label} variant="purple" />
    ));
  }

  function renderNotification(notification: LostNotification, index: number) {
    return (
      <Fragment key={`notification-${notification.petName}-${index}`}>
        {notification.petHistory?.map(({ date, id, foundedBy }) => (
          <div key={`${notification.petName}-${id}`}>
            <ViewNotifications
              dateFoundOrLost={date}
              foundedBy={foundedBy?.finderName}
              onClick={() => onOpenDialog(notification)}
              petName={notification.petName}
            />
            {renderHorizontalDivider(index + 1)}
          </div>
        ))}
      </Fragment>
    );
  }

  function renderHorizontalDivider(index: number) {
    if (notifications.length === index) return null;
    return <hr className="-mx-[10%] border-neutral-300" />;
  }

  function onOpenDialog(pet: LostNotification) {
    setSelectedPet(pet);
    setIsOpen(true);
  }

  function onCloseDialog() {
    setSelectedPet(null);
    setIsOpen(false);
  }
};
