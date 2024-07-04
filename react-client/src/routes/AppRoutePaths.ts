const myPets = "my-pets"

export const AppRoutePaths = {
  root: "/",
  account: "account",
  myPets,
  myPetsIndex: undefined,
  petProfile: `${myPets}/:petId`,
  petProfileIndex: undefined
} as const;

export type AppRoutePathIds = keyof typeof AppRoutePaths;
