export const AppRoutePaths = {
  root: "/",
  account: "account",
  addNewPet: "add",
  myPets: "my-pets",
  petProfile: ":petId",
} as const;

export const AppRoutePathsIndexes = {
  addNewPetIndex: undefined,
  myPetsIndex: undefined,
  petProfileIndex: undefined,
} as const;
