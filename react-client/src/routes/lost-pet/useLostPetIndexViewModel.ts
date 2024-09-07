import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { PetModel } from "~/domain/models/pet/PetModel";
import { getPetsList } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";

export const loader = (() => {
  return {
    pets: getPetsList(),
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
