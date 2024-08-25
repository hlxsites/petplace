import { IconKeys } from "~/components/design-system";
import { PetDocumentTypeId } from "../documents/petDocumentTypeUtils";

type PetDocumentType = {
  icon: IconKeys;
  iconColor: string;
  id: PetDocumentTypeId;
  label: string;
};

export const PET_DOCUMENT_TYPES_LIST: PetDocumentType[] = [
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
