import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";

import petListUseCaseFactory from "~/domain/useCases/pet/petListUseCaseFactory";
import { requireAuthToken } from "~/util/authUtil";

export const loader = (() => {
  const authToken = requireAuthToken();

  const useCase = petListUseCaseFactory(authToken);

  return defer({
    pets: useCase.query(),
  });
}) satisfies LoaderFunction;

export const useMyPetsIndexViewModel = () => {
  const loaderData = useLoaderData<typeof loader>();

  return loaderData;
};
