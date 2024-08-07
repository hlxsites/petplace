export const AppRoutePaths = {
  root: "/",
  account: "account",
  addNewPet: "add",
  myPets: "my-pets",
  petProfile: ":petId",
  playground: "playground",
} as const;

export const AppRoutePathsIndexes = {
  addNewPetIndex: undefined,
  myPetsIndex: undefined,
  petProfileIndex: undefined,
  playgroundIndex: undefined,
} as const;
