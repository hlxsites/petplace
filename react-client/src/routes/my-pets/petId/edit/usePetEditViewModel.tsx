import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { FormValues } from "~/components/design-system";
import { OnSubmitFn } from "~/components/design-system/form/FormBuilder";
import { BreedModel, SpeciesModel } from "~/domain/models/lookup/LookupModel";
import { PetModel, PetMutateInput } from "~/domain/models/pet/PetModel";
import getBreedListUseCaseFactory from "~/domain/useCases/lookup/getBreedListUseCaseFactory";
import getSpeciesListUseCaseFactory from "~/domain/useCases/lookup/getSpeciesListUseCaseFactory";
import petInfoUseCaseFactory from "~/domain/useCases/pet/petInfoUseCaseFactory";
import postPetImageUseCaseFactory from "~/domain/useCases/pet/postPetImageUseCaseFactory";
import { PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { forceRedirect } from "~/util/forceRedirectUtil";
import { invariantResponse } from "~/util/invariant";
import { petInfoIds } from "../form/petForm";
import { PetInfoFormVariables } from "../types/PetInfoTypes";

type EditPetModel = Omit<PetModel, "locale" | "missingStatus">;

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();
  const breedList = getBreedListUseCaseFactory(authToken).query();
  const speciesList = getSpeciesListUseCaseFactory(authToken).query();
  const useCase = petInfoUseCaseFactory(authToken);
  const postPetImageUseCase = postPetImageUseCaseFactory(authToken);
  const petInfoPromise = useCase.query(petId);

  return defer({
    breedList,
    mutatePetImage: postPetImageUseCase.mutate,
    petId,
    petInfo: petInfoPromise,
    speciesList,
    updatePetInfo: useCase.mutate,
  });
}) satisfies LoaderFunction;

export const usePetEditViewModel = () => {
  const navigate = useNavigate();

  const {
    breedList,
    mutatePetImage,
    petId,
    petInfo,
    speciesList,
    updatePetInfo,
  } = useLoaderData<typeof loader>();

  const [petInfoVariables, setPetInfoVariables] =
    useState<PetInfoFormVariables>();

  useEffect(() => {
    async function getPetInfoFormVariables() {
      const breedVariables = await breedList;
      const speciesVariables = await speciesList;

      setPetInfoVariables({
        breedVariables,
        speciesVariables,
      });
    }

    void getPetInfoFormVariables();
  }, [breedList, speciesList]);

  const onRemoveImage = () => {
    // TODO: implement image deletion
  };

  const onSelectImage = (file: File) => {
    void (async () => {
      const success = await mutatePetImage({ petId, petImage: file });
      // TODO: this should be gracefully handled by the UI instead of a force redirect
      if (success) forceRedirect(PET_PROFILE_FULL_ROUTE(petId));
    })();
  };

  const updateAndRedirect = async (values: FormValues) => {
    const petModel = buildPetInfo(values);
    const serverModel = convertToServerPetInfo(petModel);

    if (!serverModel) {
      // TODO: handle error
      return;
    }

    const didUpdate = await updatePetInfo(serverModel);

    if (didUpdate) {
      navigate(PET_PROFILE_FULL_ROUTE(petModel.id));
    } else {
      // TODO: handle error
    }
  };

  const onSubmitPetInfo: OnSubmitFn = ({ values }) => {
    void updateAndRedirect(values);
  };

  return {
    getPetInfoFormData,
    onSubmitPetInfo,
    onRemoveImage,
    onSelectImage,
    petInfo,
    petInfoVariables: getPetInfoVariables(),
  };

  function getPetInfoFormData(values: PetModel): FormValues {
    const formValues: FormValues = {
      [petInfoIds.petId]: values.id ?? "",
      [petInfoIds.age]: values.age ?? "",
      [petInfoIds.breed]: values.breed ?? "",
      [petInfoIds.dateOfBirth]: values.dateOfBirth ?? "",
      [petInfoIds.mixedBreed]: values.mixedBreed ? "Yes" : "No",
      [petInfoIds.name]: values.name ?? "",
      [petInfoIds.neuteredSpayed]: values.spayedNeutered ? "Yes" : "No",
      [petInfoIds.sex]: values.sex === "1" ? "Male" : "Female",
      [petInfoIds.species]: values.species ?? "",
      [petInfoIds.microchip]: values.microchip ?? "",
      [petInfoIds.insurance]: values.policyInsurance?.[0] ?? "",
    };

    return formValues;
  }

  function convertToServerPetInfo(data: EditPetModel): PetMutateInput | null {
    const breedId = petInfoVariables?.breedVariables.find(
      ({ name }) => data.breed === name
    )?.id;
    const specieId = petInfoVariables?.speciesVariables.find(
      ({ name }) => data.species === name
    )?.id;
    if (!breedId || !specieId) return null;

    return {
      ...data,
      breedId,
      specieId,
    };
  }

  function getPetInfoVariables() {
    return {
      breedOptions: convertToLabels(petInfoVariables?.breedVariables ?? []),
      speciesOptions: convertToLabels(petInfoVariables?.breedVariables ?? []),
    };
  }

  function convertToLabels(list: (BreedModel | SpeciesModel)[]) {
    return list.map(({ name }) => name);
  }
};

function buildPetInfo(values: FormValues): EditPetModel {
  const petInfo: EditPetModel = {
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