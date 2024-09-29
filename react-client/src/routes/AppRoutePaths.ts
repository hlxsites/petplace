export const PET_ID_ROUTE_PARAM = "petId";

export const AppRoutePaths = {
  root: "/",
  account: "account",
  accountNotifications: "notifications",
  accountNotificationId: ":notificationId",
  accountPayment: "payment-information",
  addNewPet: "add",
  checkout: "checkout",
  products: "products",
  foundPet: "found-pet",
  lostPet: "lost-pet",
  myPets: "my-pets",
  petProfile: `:${PET_ID_ROUTE_PARAM}`,
  petProfileDocuments: "documents",
  petProfileDocumentType: ":documentType",
  petEdit: "edit",
  playground: "playground",
} as const;

export const ACCOUNT_FULL_ROUTE = `/${AppRoutePaths.account}`;

export const CHECKOUT_FULL_ROUTE = (petId: string) =>
  `/${AppRoutePaths.checkout}?${PET_ID_ROUTE_PARAM}=${petId}`;

export const MY_PETS_FULL_ROUTE = `${ACCOUNT_FULL_ROUTE}/${AppRoutePaths.myPets}`;

export const PET_PROFILE_FULL_ROUTE = (petId: string) =>
  `${MY_PETS_FULL_ROUTE}/${petId}`;

export const AppRoutePathsIndexes = {
  accountIndex: undefined,
  addNewPetIndex: undefined,
  checkoutIndex: undefined,
  myPetsIndex: undefined,
  petProfileIndex: undefined,
  playgroundIndex: undefined,
  productsIndex: undefined,
} as const;
