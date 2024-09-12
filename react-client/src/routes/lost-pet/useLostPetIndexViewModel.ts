import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { PetModel } from "~/domain/models/pet/PetModel";
import petListUseCaseFactory from "~/domain/useCases/pet/petListUseCaseFactory";
import { LoaderData } from "~/types/LoaderData";
import { requireAuthToken } from "~/util/authUtil";

export const loader = (async () => {
  const authToken = requireAuthToken();
  const useCase = petListUseCaseFactory(authToken);

  return {
    pets: await useCase.query(),
  };
}) satisfies LoaderFunction;

export const useLostPetIndexViewModel = () => {
  const { pets } = useLoaderData() as LoaderData<typeof loader>;
  const [selectedPet, setSelectedPet] = useState<PetModel | null>(null);

  const onSelectPet = (petName: string) => {
    const pet = pets.find((pet) => pet.name === petName);
    if (pet) setSelectedPet(pet);
  };

  return {
    onSelectPet,
    pets,
    selectedPet,
  };
};
