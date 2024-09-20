import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import getCheckoutFactory from "~/domain/useCases/checkout/getCheckoutFactory";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { requireAuthToken } from "~/util/authUtil";

import { invariantResponse } from "~/util/invariant";

export const loader = (async ({ request }) => {
  const url = new URL(request.url);
  const petId = url.searchParams.get("petId");
  invariantResponse(petId, "petId param is required");

  const authToken = requireAuthToken();
  const useCase = getCheckoutFactory(authToken);

  const checkoutData = await useCase.query(petId);

  return defer({
    checkoutData,
  });
}) satisfies LoaderFunction;

export const useCheckoutIndexViewModel = () => {
  const { checkoutData } = useLoaderData<typeof loader>();
  const renderMobileVersion = useWindowWidth() < 768;

  return {
    actionButtons: checkoutData?.actionButtons || [],
    availablePlans: checkoutData?.availablePlans || [],
    renderMobileVersion,
    plans: checkoutData?.plans || [],
  };
};
