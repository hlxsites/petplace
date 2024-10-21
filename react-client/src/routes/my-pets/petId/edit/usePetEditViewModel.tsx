import { isEqual } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { FormValues } from "~/components/design-system";
import {
  OnChangeFn,
  OnSubmitFn,
} from "~/components/design-system/form/FormBuilder";
import { BreedModel, SpeciesModel } from "~/domain/models/lookup/LookupModel";
import { PetModel, PetMutateInput } from "~/domain/models/pet/PetModel";
import getBreedListUseCaseFactory from "~/domain/useCases/lookup/getBreedListUseCaseFactory";
import getSpeciesListUseCaseFactory from "~/domain/useCases/lookup/getSpeciesListUseCaseFactory";
import petInfoUseCaseFactory from "~/domain/useCases/pet/petInfoUseCaseFactory";
import postPetImageUseCaseFactory from "~/domain/useCases/pet/postPetImageUseCaseFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { parseDateToFormat } from "~/util/dateUtils";
import { forceReload } from "~/util/forceRedirectUtil";
import { invariantResponse } from "~/util/invariant";
import { editPetProfileFormSchema, petInfoIds } from "../form/petForm";

type EditPetModel = Omit<PetModel, "locale" | "missingStatus">;

export const loader = (({ params }) => {
  const { petId } = params;
  invariantResponse(petId, "Pet ID is required in this route");

  const authToken = requireAuthToken();
  const breedsQuery = getBreedListUseCaseFactory(authToken).query;
  const speciesQuery = getSpeciesListUseCaseFactory(authToken).query;
  const petInfoUseCase = petInfoUseCaseFactory(authToken);
  const postPetImageUseCase = postPetImageUseCaseFactory(authToken);
  const petInfoQuery = petInfoUseCase.query(petId);

  return defer({
    breedsQuery,
    mutatePetImage: postPetImageUseCase.mutate,
    petId,
    petInfoQuery,
    speciesQuery,
    mutatePetInfo: petInfoUseCase.mutate,
  });
}) satisfies LoaderFunction;

export const usePetEditViewModel = () => {
  const {
    breedsQuery,
    mutatePetImage,
    petId,
    petInfoQuery,
    speciesQuery,
    mutatePetInfo,
  } = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const [speciesList, setSpeciesList] = useState<SpeciesModel[]>([]);
  const [breedsList, setBreedsList] = useState<BreedModel[]>([]);
  const [hasPolicy, setHasPolicy] = useState(false);

  const initialPetFormValuesRef = useRef<FormValues>({});

  const [petFormValues, setPetFormValues] = useState<FormValues>({});
  const [isLoadingPet, setIsLoadingPet] = useState(true);
  const [isSubmittingPet, setIsSubmittingPet] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const selectedSpecies = speciesList.find(
    (species) => species.name === petFormValues.species
  );

  const isDirtyPetForm = !isEqual(
    petFormValues,
    initialPetFormValuesRef.current
  );

  const isDiscardingPetForm = isDirtyPetForm && isLeaving;

  const fetchPetForm = useCallback(async () => {
    const response = await petInfoQuery;
    setHasPolicy(!!response?.policyInsurance?.length);

    const initialValues = getPetInfoFormData(response);
    const speciesResultList = await speciesQuery();
    setSpeciesList(speciesResultList);
    const selectedSpecies = speciesResultList.find(
      ({ name }) => name === initialValues.species
    );

    if (selectedSpecies && initialValues.breed) {
      const breedsResultList = await breedsQuery(selectedSpecies.id);
      setBreedsList(breedsResultList);
    }

    initialPetFormValuesRef.current = { ...initialValues };

    setPetFormValues(initialValues);
    setIsLoadingPet(false);
  }, [breedsQuery, petInfoQuery, speciesQuery]);

  useEffect(() => {
    void fetchPetForm();
  }, [fetchPetForm]);

  useDeepCompareEffect(() => {
    const fetchBreedsBySpecies = async (speciesId: number) => {
      const breedsList = await breedsQuery(speciesId);
      setBreedsList(breedsList);
    };

    if (selectedSpecies?.id) {
      void fetchBreedsBySpecies(selectedSpecies.id);
    }
  }, [breedsQuery, selectedSpecies?.id]);

  const onRemoveImage = () => {
    // TODO: implement image deletion
  };

  const onSelectImage = (file: File) => {
    void (async () => {
      const success = await mutatePetImage({ petId, petImage: file });
      // TODO: this should be gracefully handled by the UI instead of a force redirect
      if (success) forceReload();
    })();
  };

  const onChangePetFormValues: OnChangeFn = (values) => {
    setPetFormValues((prevState) => {
      // verify if species has changed
      const countryChanged =
        values[petInfoIds.species] !== prevState[petInfoIds.species];
      if (countryChanged) {
        // reset breed when specie changes
        values[petInfoIds.breed] = "";

        // reset breeds list when specie changes
        setBreedsList([]);
      }
      return values;
    });
  };

  const asyncSubmitPetInfo = async (values: FormValues) => {
    setIsSubmittingPet(true);

    const petInfo = convertFormValuesToPetInfo(values);
    const serverModel = convertToServerPetInfo(petInfo);

    if (serverModel) {
      const response = await mutatePetInfo(serverModel);
      if (response) {
        navigate(PET_PROFILE_FULL_ROUTE(petInfo.id));
        initialPetFormValuesRef.current = values;
      }
    }

    setIsSubmittingPet(false);
  };

  const onSubmitPetInfo: OnSubmitFn = ({ values }) => {
    void asyncSubmitPetInfo(values);
  };

  const petFormSchema = editPetProfileFormSchema(hasPolicy);

  return {
    form: {
      isDiscarding: isDiscardingPetForm,
      isLoading: isLoadingPet,
      isSubmitting: isSubmittingPet,
      onChange: onChangePetFormValues,
      onSubmit: onSubmitPetInfo,
      schema: petFormSchema,
      values: petFormValues,
      variables: getPetInfoOptions(),
    },
    handleClose,
    handleReset,
    onRemoveImage,
    onSelectImage,
    onDiscard,
    petId,
    petInfoQuery,
    setIsLeaving,
  };

  function onDiscard() {
    navigate(PET_PROFILE_FULL_ROUTE(petId));
  }

  function handleClose() {
    setIsLeaving(false);
  }

  function handleReset() {
    if (!isDirtyPetForm) onDiscard();
    setIsLeaving(true);
  }

  function convertToServerPetInfo(data: EditPetModel): PetMutateInput | null {
    const breedId = breedsList.find(({ name }) => data.breed === name)?.id;
    const specieId = speciesList.find(({ name }) => data.species === name)?.id;
    if (!breedId || !specieId) return null;

    return {
      ...data,
      breedId,
      specieId,
    };
  }

  function getPetInfoOptions() {
    return {
      breedOptions: breedsList.map(({ name }) => name),
      speciesOptions: speciesList.map(({ name }) => name),
    };
  }
};

function convertFormValuesToPetInfo(values: FormValues): EditPetModel {
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

function getPetInfoFormData(values: PetModel | null): FormValues {
  if (!values) return {};

  return {
    [petInfoIds.petId]: values.id ?? "",
    [petInfoIds.age]: values.age ?? "",
    [petInfoIds.breed]: values.breed ?? "",
    [petInfoIds.dateOfBirth]: values.dateOfBirth ?? "",
    [petInfoIds.displayDateOfBirth]: parseDateToFormat(
      values.dateOfBirth ?? ""
    ),
    [petInfoIds.mixedBreed]: values.mixedBreed ? "Yes" : "No",
    [petInfoIds.name]: values.name ?? "",
    [petInfoIds.neuteredSpayed]: values.spayedNeutered ? "Yes" : "No",
    [petInfoIds.sex]: values.sex === "1" ? "Male" : "Female",
    [petInfoIds.species]: values.species ?? "",
    [petInfoIds.microchip]: values.microchip ?? "",
    [petInfoIds.insurance]: values.policyInsurance?.[0] ?? "",
  };
}
