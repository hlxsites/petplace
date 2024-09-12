import { AnimalSex } from "~/types/AnimalSexEnum";

const UNKNOWN_TEXT = "Unknown";

export function getAnimalSex(sex?: string): string {
  if (!sex) return UNKNOWN_TEXT;

  const animalSexMap: Record<AnimalSex, string> = {
    [AnimalSex.Male]: "Male",
    [AnimalSex.Female]: "Female",
  };

  return animalSexMap[sex as AnimalSex] || UNKNOWN_TEXT;
}
