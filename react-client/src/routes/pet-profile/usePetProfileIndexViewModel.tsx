import { LoaderFunction, useLoaderData } from "react-router-dom";
import { getPetsList } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";

export const loader = (({ params }) => {
  const { petId } = params;

  const petInfo = getPetsList()?.find((pet) => pet.id === petId);

  return {
    petInfo,
  };
}) satisfies LoaderFunction;

export const usePetProfileIndexViewModel = () => {
  const { petInfo } = useLoaderData() as LoaderData<typeof loader>;

  return {
    petInfo,
  };
};
