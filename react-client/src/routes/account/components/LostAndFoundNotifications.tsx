import { Card, Title } from "~/components/design-system";
import { ViewNotifications } from "./ViewNotifications";

import { useState } from "react";
import { LostPetUpdateModel } from "~/domain/models/user/UserModels";
import { NotificationsDialog } from "./NotificationsDialog";

export type LostAndFoundNotificationsProps = {
  notifications: LostPetUpdateModel[];
};

export const LostAndFoundNotifications = ({
  notifications = [],
}: LostAndFoundNotificationsProps) => {
  const [selectedNotification, setSelectedNotification] =
    useState<LostPetUpdateModel | null>(null);

  return (
    <>
      <Card>
        <div className="p-xxlarge">
          <div className="flex items-center justify-between pb-large">
            <Title level="h3">Lost & Found notifications</Title>
          </div>

          {!!notifications.length && (
            <Card>
              <div className="p-large">
                {notifications.map(renderNotification)}
              </div>
            </Card>
          )}
        </div>
      </Card>

      {!!selectedNotification && (
        <NotificationsDialog
          isOpen
          onClose={onCloseDialog}
          viewData={selectedNotification}
          petName={selectedNotification.petName}
        />
      )}
    </>
  );

  function renderNotification(notification: LostPetUpdateModel, index: number) {
    const { date, id, foundedBy, petName } = notification;
    const isLast = notifications.length === index + 1;

    const dividerElement = (() => {
      if (isLast) return null;
      return <hr className="-mx-[10%] border-neutral-300" />;
    })();

    return (
      <div key={`${petName}-${id}`}>
        <ViewNotifications
          dateFoundOrLost={date}
          foundedBy={foundedBy?.finderName}
          onClick={() => onOpenDialog(notification)}
          petName={petName}
        />
        {dividerElement}
      </div>
    );
  }

  function onOpenDialog(notification: LostPetUpdateModel) {
    setSelectedNotification(notification);
  }

  function onCloseDialog() {
    setSelectedNotification(null);
  }
};
