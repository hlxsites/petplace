import { LoaderFunction, useLoaderData } from "react-router-dom";
import { getPetsList } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";

export const loader = (() => {
  return {
    pets: getPetsList(),
  };
}) satisfies LoaderFunction;

export const useMyPetsIndexViewModel = () => {
  const { pets } = useLoaderData() as LoaderData<typeof loader>;

  return {
    pets,
  };
};
