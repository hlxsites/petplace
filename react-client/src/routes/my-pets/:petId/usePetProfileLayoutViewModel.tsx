import {
  LoaderFunction,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { getPetById } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";
import { invariantResponse } from "~/util/invariant";

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const petInfo = getPetById(petId);
  invariantResponse(petInfo, "Pet not found", {
    status: 404,
  });

  return { petInfo };
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const { petInfo } = useLoaderData() as LoaderData<typeof loader>;

  return {
    petInfo,
  };
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();