import { LoaderFunction, useLoaderData } from "react-router-dom";
import petListUseCaseFactory from "~/domain/useCases/pet/petListUseCaseFactory";
import { LoaderData } from "~/types/LoaderData";
import { requireAuthToken } from "~/util/authUtil";

export const loader = (async () => {
  const authToken = requireAuthToken();

  const useCase = petListUseCaseFactory(authToken);

  return {
    pets: await useCase.query(),
  };
}) satisfies LoaderFunction;

export const useMyPetsIndexViewModel = () => {
  const { pets } = useLoaderData() as LoaderData<typeof loader>;

  return {
    pets,
  };
};
