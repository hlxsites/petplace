import { LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LostPetUpdateModel } from "~/domain/models/pet/PetModel";
import lostPetNotificationDetailsUseCaseFactory from "~/domain/useCases/user/lostPetNotificationDetailsUseCaseFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { invariantResponse } from "~/util/invariant";
import { useAccountNotificationsIndexContext } from "../useAccountNotificationsIndexViewModel";

export const loader = (({ params }) => {
  const { notificationId } = params;
  invariantResponse(
    notificationId,
    "Notification id is required in this route"
  );

  const authToken = requireAuthToken();
  const useCase = lostPetNotificationDetailsUseCaseFactory(authToken);

  const query = (selectedNotification: LostPetUpdateModel) =>
    useCase.query(selectedNotification);

  return {
    notificationId,
    query,
  };
}) satisfies LoaderFunction;

export const useNotificationsIdViewModel = () => {
  const { notificationId, query } = useLoaderData<typeof loader>();
  const { lostPetsHistory } = useAccountNotificationsIndexContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [baseNotification, setBaseNotification] =
    useState<LostPetUpdateModel | null>(null);

  const notificationRef = useRef<LostPetUpdateModel | null>(null);

  useDeepCompareEffect(() => {
    const onFetchBaseNotification = async () => {
      if (baseNotification) {
        const notification = await query(baseNotification);
        notificationRef.current = notification;
        setIsLoading(false);
        return;
      }

      const notifications = await lostPetsHistory;
      const selected = notifications.find(
        ({ communicationId }) => communicationId === notificationId
      );

      if (selected && !baseNotification) {
        setBaseNotification(selected);
      }
    };

    void onFetchBaseNotification();
  }, [baseNotification, lostPetsHistory, notificationId]);

  const onClose = () => {
    navigate("..", {
      replace: true,
    });
  };

  return {
    baseNotification,
    isLoading,
    onClose,
    notification: notificationRef.current,
  };
};
