import { LoaderFunction, useLoaderData } from "react-router-dom";
import { LoaderData } from "~/types/LoaderData";

export const loader = (() => {
  return {
    petRegistration: [],
  };
}) satisfies LoaderFunction;

export const useAddNewPetIndexViewModel = () => {
  const { petRegistration } = useLoaderData() as LoaderData<typeof loader>;

  return {
    petRegistration,
  };
};
