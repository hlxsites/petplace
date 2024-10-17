import { LoaderFunction, useLoaderData } from "react-router-typesafe";

export const loader = (() => {
  return {
    petRegistration: [],
  };
}) satisfies LoaderFunction;

export const useAddNewPetIndexViewModel = () => {
  const { petRegistration } = useLoaderData<typeof loader>();

  return {
    petRegistration,
  };
};
