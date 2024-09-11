import { AnimalSex } from "~/types/AnimalSexEnum";

export function getAnimalSex(sex?: string): string {
  const animalSexMap: Record<AnimalSex, string> = {
    [AnimalSex.Male]: "Male",
    [AnimalSex.Female]: "Female",
  };

  if (!sex) {
    return "Unknown";
  }

  return animalSexMap[sex as AnimalSex] || "Unknown";
}
