import {
  LoaderFunction,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { IconKeys } from "~/components/design-system";
import { getPetById } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";
import { invariantResponse } from "~/util/invariant";
import { PetDocumentTypeId } from "./documents/petDocumentTypeUtils";

type PetDocumentType = {
  icon: IconKeys;
  iconColor: string;
  id: PetDocumentTypeId;
  label: string;
};

const PET_DOCUMENT_TYPES_LIST: PetDocumentType[] = [
  {
    icon: "medicine",
    iconColor: "text-green-300",
    id: "medical-records",
    label: "Medical Records",
  },
  {
    icon: "syringe",
    iconColor: "text-purple-300",
    id: "vaccines",
    label: "Vaccines",
  },
  { icon: "pippet", iconColor: "text-blue-300", id: "tests", label: "Tests" },
  {
    icon: "file",
    iconColor: "text-orange-300-contrast",
    id: "other",
    label: "Other documents",
  },
];

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const petInfo = getPetById(petId);
  invariantResponse(petInfo, "Pet not found", {
    status: 404,
  });

  return { documentTypes: PET_DOCUMENT_TYPES_LIST, petInfo };
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const loaderData = useLoaderData() as LoaderData<typeof loader>;

  return loaderData;
};

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
