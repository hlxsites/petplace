import { Card, Dialog, Title } from "~/components/design-system";
import { ViewNotifications } from "../../components/ViewNotifications";

import { useState } from "react";
import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { LostPetUpdateModel } from "~/domain/models/user/UserModels";
import { NotificationsDialogContent } from "../../components/NotificationsDialogContent";

export type LostAndFoundNotificationsProps = {
  notifications: LostPetUpdateModel[];
  getLostPetNotificationDetails?: (
    notification: LostPetUpdateModel
  ) => Promise<LostPetUpdateModel | null>;
};

export const LostAndFoundNotifications = ({
  notifications = [],
  getLostPetNotificationDetails,
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

      {renderNotificationDialog()}
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

  function renderNotificationDialog() {
    if (!selectedNotification) return null;

    return (
      <Dialog
        ariaLabel="Notifications"
        id="notifications-dialog"
        isOpen={!!selectedNotification}
        onClose={onCloseDialog}
        title={`Pet ${selectedNotification.petName} is found by ${selectedNotification.foundedBy?.finderName}.`}
        titleSize="32"
        trigger={undefined}
        isTitleResponsive
      >
        <SuspenseAwait
          resolve={getLostPetNotificationDetails?.(selectedNotification)}
        >
          {(selectedNotificationDetails) =>
            !!selectedNotificationDetails && (
              <NotificationsDialogContent
                isOpen={!!selectedNotificationDetails}
                onClose={onCloseDialog}
                viewData={selectedNotificationDetails}
              />
            )
          }
        </SuspenseAwait>
      </Dialog>
    );
  }

  function onOpenDialog(notification: LostPetUpdateModel) {
    setSelectedNotification(notification);
  }

  function onCloseDialog() {
    setSelectedNotification(null);
  }
};
