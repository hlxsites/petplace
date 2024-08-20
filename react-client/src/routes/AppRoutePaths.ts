export const AppRoutePaths = {
  root: "/",
  account: "account",
  addNewPet: "add",
  checkout: "checkout",
  foundPet: "found-pet",
  lostPet: "lost-pet",
  myPets: "my-pets",
  petProfile: ":petId",
  petProfileDocuments: "documents",
  petProfileDocumentType: ":documentType",
  petEdit: "edit",
  playground: "playground",
} as const;

export const AppRoutePathsIndexes = {
  addNewPetIndex: undefined,
  checkoutIndex: undefined,
  myPetsIndex: undefined,
  petProfileIndex: undefined,
  playgroundIndex: undefined,
} as const;
