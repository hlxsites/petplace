import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { FormValues } from "~/components/design-system";
import { BreedModel, SpeciesModel } from "~/domain/models/lookup/LookupModel";
import { PetModel } from "~/domain/models/pet/PetModel";
import getBreedListUseCaseFactory from "~/domain/useCases/lookup/getBreedListUseCaseFactory";
import getSpeciesListUseCaseFactory from "~/domain/useCases/lookup/getSpeciesListUseCaseFactory";
import { PutPetInfoRequest } from "~/domain/useCases/pet/PetInfoUseCase";
import petInfoUseCaseFactory from "~/domain/useCases/pet/petInfoUseCaseFactory";
import { AppRoutePaths, PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { invariantResponse } from "~/util/invariant";
import { petInfoIds } from "./form/petForm";
import { PetInfoFormVariables } from "./types/PetInfoTypes";
import { buildPetInfo } from "./utils/formDataUtil";
import { PET_DOCUMENT_TYPES_LIST } from "./utils/petDocumentConstants";

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();
  const breedList = getBreedListUseCaseFactory(authToken).query();
  const speciesList = getSpeciesListUseCaseFactory(authToken).query();
  const useCase = petInfoUseCaseFactory(authToken);
  const petInfoPromise = useCase.query(petId);

  return defer({
    breedList,
    documentTypes: PET_DOCUMENT_TYPES_LIST,
    petInfo: petInfoPromise,
    speciesList,
    updatePetInfo: useCase.mutate,
  });
}) satisfies LoaderFunction;

export const usePetProfileLayoutViewModel = () => {
  const navigate = useNavigate();
  const { updatePetInfo, breedList, speciesList, ...rest } =
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

  const onEditPet = () => {
    navigate(AppRoutePaths.petEdit);
  };

  return {
    ...rest,
    getPetInfoFormData,
    onEditPet,
    onSubmitPetInfo,
    petInfoVariables: getPetInfoVariables(),
  };

  function onSubmitPetInfo(values: FormValues) {
    const petModel = buildPetInfo(values);
    const serverModel = convertToServerPetInfo(petModel);
    void updateAndRedirect(serverModel);
  }

  async function updateAndRedirect(data: PutPetInfoRequest) {
    const didUpdate = await updatePetInfo(data);
    if (didUpdate) navigate(PET_PROFILE_FULL_ROUTE(data.Id));
  }

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

    console.log("🚀 ~ formValues", formValues);

    return formValues;
  }

  function convertToServerPetInfo(data: PetModel): PutPetInfoRequest {
    return {
      Id: data.id,
      Name: data.name,
      Sex: data.sex === "Male" ? "1" : "2",
      DateOfBirth: data.dateOfBirth ?? "",
      Neutered: !!data.spayedNeutered,
      SpeciesId:
        petInfoVariables?.speciesVariables.find(
          ({ name }) => data.species === name
        )?.id ?? 1,
      BreedId:
        // @ts-expect-error the ? check seems not to be resolving the undefined possibility for the next line
        petInfoVariables?.breedVariables.find(({ name }) => data.breed === name)
          .id ?? 0,
      MixedBreed: !!data.mixedBreed,
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

export const usePetProfileContext = () =>
  useOutletContext<ReturnType<typeof usePetProfileLayoutViewModel>>();
