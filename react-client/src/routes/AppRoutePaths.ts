export const AppRoutePaths = {
  root: "/",
  account: "account",
  myPets: "my-pets",
  petProfile: ":petId",
} as const;

export const AppRoutePathsIndexes = {
  myPetsIndex: undefined,
  petProfileIndex: undefined,
} as const;
