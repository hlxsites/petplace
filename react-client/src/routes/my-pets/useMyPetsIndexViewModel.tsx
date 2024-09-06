import { LoaderFunction, useLoaderData } from "react-router-dom";
import { GetPetsListUseCase } from "~/domain/useCases/pet/GetPetsListUseCase";
import { getPetsList } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";
import { requireAuthToken } from "~/util/authUtil";

export const loader = (async () => {
  const authToken = requireAuthToken();

  const useCase = new GetPetsListUseCase(authToken);
  const list = await useCase.query();

  return {
    // TODO: stop using mock data here
    pets: list.length ? list : getPetsList(),
  };
}) satisfies LoaderFunction;

export const useMyPetsIndexViewModel = () => {
  const { pets } = useLoaderData() as LoaderData<typeof loader>;

  return {
    pets,
  };
};
