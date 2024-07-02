export const AppRoutePaths = {
  root: "/",
  account: "account",
  myPets: "my-pets",
  myPetsIndex: undefined,
} as const;

export type AppRoutePathIds = keyof typeof AppRoutePaths;
