const myPets = "my-pets";

export const AppRoutePaths = {
  root: "/",
  account: "account",
  myPets,
  petProfile: `${myPets}/:petId`
} as const;

export const AppRoutePathsIndexes = {
  myPetsIndex: undefined,
  petProfileIndex: undefined
} as const;
