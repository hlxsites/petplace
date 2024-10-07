import { FormValues } from "~/components/design-system";
import { PetModel } from "~/domain/models/pet/PetModel";
import { petInfoIds } from "../form/petForm";

export function buildPetInfo(values: FormValues) {
  const petInfo: PetModel = {
    id: values[petInfoIds.petId] as string,
    breed: values[petInfoIds.breed] as string,
    dateOfBirth: values[petInfoIds.dateOfBirth] as string,
    mixedBreed: values[petInfoIds.mixedBreed] === "Yes",
    name: values[petInfoIds.name] as string,
    spayedNeutered: values[petInfoIds.neuteredSpayed] === "Yes",
    sex: values[petInfoIds.sex] as string,
    species: values[petInfoIds.species] as string,
  };

  return petInfo;
}
