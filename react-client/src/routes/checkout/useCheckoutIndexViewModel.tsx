import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import getCheckoutFactory from "~/domain/useCases/checkout/getCheckoutFactory";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { requireAuthToken } from "~/util/authUtil";

import { invariantResponse } from "~/util/invariant";
import { PET_ID_ROUTE_PARAM } from "../AppRoutePaths";

export const loader = (async ({ request }) => {
  const url = new URL(request.url);
  const petId = url.searchParams.get(PET_ID_ROUTE_PARAM);
  invariantResponse(petId, "petId param is required");

  const authToken = requireAuthToken();
  const useCase = getCheckoutFactory(authToken);

  const checkoutData = await useCase.query(petId);

  return defer({
    actionButtons: checkoutData?.actionButtons || [],
    plans: checkoutData?.plans || [],
  });
}) satisfies LoaderFunction;

export const useCheckoutIndexViewModel = () => {
  const { actionButtons, plans } = useLoaderData<typeof loader>();
  const renderMobileVersion = useWindowWidth() < 768;

  return {
    actionButtons,
    renderMobileVersion,
    plans,
  };
};
