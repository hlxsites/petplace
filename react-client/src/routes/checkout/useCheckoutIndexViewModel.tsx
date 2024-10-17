import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import getCheckoutFactory from "~/domain/useCases/checkout/getCheckoutFactory";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { requireAuthToken } from "~/util/authUtil";

import { invariantResponse } from "~/util/invariant";
import { PET_ID_ROUTE_PARAM } from "../AppRoutePaths";
import petInfoUseCaseFactory from "~/domain/useCases/pet/petInfoUseCaseFactory";
import { useState } from "react";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";

export const loader = (async ({ request }) => {
  const url = new URL(request.url);
  const petId = url.searchParams.get(PET_ID_ROUTE_PARAM);
  invariantResponse(petId, "petId param is required");

  const authToken = requireAuthToken();
  const useCase = getCheckoutFactory(authToken);
  const petInfoUseCase = petInfoUseCaseFactory(authToken);

  const petInfoPromise = petInfoUseCase.query(petId);
  const checkoutData = await useCase.query(petId);

  return defer({
    plans: checkoutData?.plans || [],
    petInfoPromise,
  });
}) satisfies LoaderFunction;

export const useCheckoutIndexViewModel = () => {
  const { plans, petInfoPromise } = useLoaderData<typeof loader>();
  const renderMobileVersion = useWindowWidth() < 768;

  const [petName, setPetName] = useState<string | undefined>(undefined);

  useDeepCompareEffect(() => {
    async function resolvePetInfoPromise() {
      const petInfo = await petInfoPromise;
      setPetName(petInfo?.name);
    }

    void resolvePetInfoPromise();
  }, [petInfoPromise]);

  return {
    renderMobileVersion,
    petName,
    plans,
  };
};
