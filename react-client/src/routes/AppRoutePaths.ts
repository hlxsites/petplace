export const AppRoutePaths = {
  root: "/",
  account: "account",
  addNewPet: "add",
  checkout: "checkout",
  products: "products",
  foundPet: "found-pet",
  lostPet: "lost-pet",
  myPets: "my-pets",
  petProfile: ":petId",
  petProfileDocuments: "documents",
  petProfileDocumentType: ":documentType",
  petEdit: "edit",
  playground: "playground",
} as const;

export const MY_PETS_FULL_ROUTE = `/${AppRoutePaths.account}/${AppRoutePaths.myPets}`;

export const PET_PROFILE_FULL_ROUTE = (petId: string) =>
  `${MY_PETS_FULL_ROUTE}/${petId}`;

export const AppRoutePathsIndexes = {
  accountIndex: undefined,
  addNewPetIndex: undefined,
  checkoutIndex: undefined,
  myPetsIndex: undefined,
  petProfileIndex: undefined,
  playgroundIndex: undefined,
} as const;
