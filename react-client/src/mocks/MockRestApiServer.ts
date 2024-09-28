import { PETS_LIST } from "~/domain/useCases/pet/mocks/petsListMock";

export type DocumentationStatus =
  | "none"
  | "sent"
  | "approved"
  | "failed"
  | "inProgress";

// TODO This will be deleted once the description of the product is done

export type CheckoutServices = {
  title: string;
  price: string;
  id: string;
  description: string;
  isAnnual?: boolean;
  images: string[];
};

const CHECKOUT_SERVICES: CheckoutServices[] = [];

export const getServicesList = () => {
  return CHECKOUT_SERVICES;
};

export const getLostPetsHistory = () => {
  return PETS_LIST.filter((pet) =>
    pet.lostPetHistory?.some((history) => history.foundedBy)
  ).map((pet) => {
    const petName = pet.name;
    const petHistory = pet.lostPetHistory?.filter(
      (history) => history.foundedBy
    );
    return { petName, petHistory };
  });
};
