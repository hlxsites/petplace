import { LoaderFunction, useLoaderData } from "react-router-dom";
import { LoaderData } from "~/types/LoaderData";

export const loader = (({}) => {
  return {
    petInfo: [],
  };
}) satisfies LoaderFunction;

export const usePetProfileIndexViewModel = () => {
  const { petInfo } = useLoaderData() as LoaderData<typeof loader>;

  return {
    petInfo,
  };
};
