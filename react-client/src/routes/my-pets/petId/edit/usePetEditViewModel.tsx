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
import { invariantResponse } from "~/util/invariant";
import { petInfoIds } from "../form/petForm";
import { PetInfoFormVariables } from "../types/PetInfoTypes";

import { buildPetInfo } from "../utils/formDataUtil";

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
    petInfo: petInfoPromise,
    speciesList,
    updatePetInfo: useCase.mutate,
    mutatePetImage: postPetImageUseCase.mutate,
  });
}) satisfies LoaderFunction;

export const usePetEditViewModel = () => {
  const navigate = useNavigate();

  const { breedList, mutatePetImage, petInfo, speciesList, updatePetInfo } =
    useLoaderData<typeof loader>();

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

  const onSelectImage = (petId: string, file: File) => {
    console.log("onSelectImage", petId, file);
    void mutatePetImage({ petId, petImage: file });
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
      [petInfoIds.insurance]: (values.policyInsurance as string[])[0] ?? "",
    };

    return formValues;
  }

  function convertToServerPetInfo(data: PetModel): PetMutateInput | null {
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
