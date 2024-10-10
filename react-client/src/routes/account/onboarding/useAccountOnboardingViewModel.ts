import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import PetNewAdoptionsFactoryUseCase from "~/domain/useCases/pet/PetNewAdoptionsFactoryUseCase";
import { MY_PETS_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { CONTENT_PARAM_KEY } from "~/util/searchParamsKeys";

export const loader = (() => {
  const authToken = requireAuthToken();

  const useCase = PetNewAdoptionsFactoryUseCase(authToken);

  return defer({
    petsListPromise: useCase.query(),
  });
}) satisfies LoaderFunction;

export const useAccountOnboardingViewModel = () => {
  const navigate = useNavigate();
  const { petsListPromise } = useLoaderData<typeof loader>();

  useEffect(() => {
    const fetchPetsList = async () => {
      const list = await petsListPromise;

      // Try to get a pet with checkout available
      const selectedPet = list.find((p) => p.isCheckoutAvailable) || list[0];

      const url = (() => {
        const baseUrl = `${MY_PETS_FULL_ROUTE}?${CONTENT_PARAM_KEY}=onboarding`;
        if (!list.length) return baseUrl;

        return `${baseUrl}&petId=${selectedPet.id}`;
      })();

      navigate(url, { replace: true });
    };

    void fetchPetsList();
  }, [navigate, petsListPromise]);

  return {
    isLoading: true,
  };
};
