import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import {
  DocumentationStatus,
  PetInAdoptionList,
} from "~/domain/models/pet/PetModel";
import PetDocumentConsentFactoryUseCase from "~/domain/useCases/pet/PetDocumentConsentFactoryUseCase";

import petListUseCaseFactory from "~/domain/useCases/pet/petListUseCaseFactory";
import PetNewAdoptionsFactoryUseCase from "~/domain/useCases/pet/PetNewAdoptionsFactoryUseCase";
import { requireAuthToken } from "~/util/authUtil";
import { CONTENT_PARAM_KEY } from "~/util/searchParamsKeys";

export const loader = (() => {
  const authToken = requireAuthToken();

  const useCase = petListUseCaseFactory(authToken);
  const newAdoptionsUseCase = PetNewAdoptionsFactoryUseCase(authToken);
  const petDocumentConsentUseCase = PetDocumentConsentFactoryUseCase(authToken);

  return defer({
    newAdoptionsPetsPromise: newAdoptionsUseCase.query(),
    petsPromise: useCase.query(),
    submitConsent: petDocumentConsentUseCase.mutate,
  });
}) satisfies LoaderFunction;

export const useMyPetsIndexViewModel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { newAdoptionsPetsPromise, petsPromise, submitConsent } =
    useLoaderData<typeof loader>();

  const [adoptionPets, setAdoptionPets] = useState<PetInAdoptionList[]>([]);
  const [documentStatus, setDocumentStatus] =
    useState<DocumentationStatus>("none");

  const selectedAdoptionPet = (() => {
    const petId = searchParams.get("petId");
    if (!petId) return null;
    return adoptionPets.find((pet) => pet.id === petId) || null;
  })();

  const shouldDisplayOnboarding = (() => {
    const contentParam = searchParams.get(CONTENT_PARAM_KEY);
    if (!contentParam) return false;

    return contentParam === "onboarding";
  })();

  useEffect(() => {
    if (!shouldDisplayOnboarding) return;

    void (async () => {
      const pets = await newAdoptionsPetsPromise;
      setAdoptionPets(pets);
    })();
  }, [newAdoptionsPetsPromise, shouldDisplayOnboarding]);

  const onSubmitConsent = (consent: boolean) => {
    // Only set status to sent if consent is true
    if (consent) setDocumentStatus("sent");

    void (async () => {
      const adoptedPetsList = await newAdoptionsPetsPromise;
      const microchips: string[] = [];

      adoptedPetsList.forEach((pet) => {
        if (pet.microchip) microchips.push(pet.microchip);
      });

      if (microchips.length) {
        await submitConsent({
          consent,
          microchips,
        });
      }

      // Only set status to sent if consent is true
      if (consent) setDocumentStatus("inProgress");
    })();
  };

  const onCloseOnboarding = () => {
    setSearchParams(new URLSearchParams(), {
      replace: true,
    });
  };

  return {
    documentStatus,
    onCloseOnboarding,
    onSubmitConsent,
    petsPromise,
    selectedAdoptionPet,
    shouldDisplayOnboarding,
  };
};
