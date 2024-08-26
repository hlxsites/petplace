/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";
import { PetServiceTypes } from "~/routes/my-pets/petId/types/PetServicesTypes";

const PET_SERVICES: Record<string, PetServiceTypes> = {
  buddy: "standard",
  lily: "lifetimePlus",
  charlie: "expired",
};

const PET_RECORDS = {
  buddy: {
    "medical-records": [
      {
        id: "medical-1",
        downloadPath:
          "https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf",
        fileName: "Buddy's medical record #1",
        fileType: "pdf",
      },
      {
        id: "medical-2",
        downloadPath:
          "https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf",
        fileName: "Buddy's medical record #2",
        fileType: "pdf",
      },
    ],
    other: [
      {
        downloadPath:
          "https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf",
        fileName: "PDF-Git sheet",
        fileType: "pdf",
        id: "756",
      },
    ],
  },
  lily: {
    vaccines: [
      {
        id: "vaccine-1",
        downloadPath:
          "https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf",
        fileName: "Lily's vaccine record #1",
        fileType: "pdf",
      },
      {
        id: "vaccine-2",
        downloadPath:
          "https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf",
        fileName: "Lily's vaccine record #2",
        fileType: "pdf",
      },
    ],
    other: [
      {
        downloadPath:
          "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg",
        fileName: "Lily's photo",
        fileType: "jpg",
        id: "123",
      },
      {
        downloadPath:
          "https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf",
        fileName: "PDF-Git sheet",
        fileType: "pdf",
        id: "756",
      },
    ],
  },
};

export type PetInfo = {
  age?: string | undefined;
  breed?: string;
  dateOfBirth?: string;
  id: string;
  img?: string;
  isProtected?: boolean;
  microchipNumber?: number;
  mixedBreed?: string;
  name: string;
  onboardCompleted?: boolean;
  sex?: string;
  spayedNeutered?: boolean;
  species?: string;
  documentationStatus?: DocumentationStatus;
  missingStatus?: MissingStatus;
  lostPetHistory?: LostPetUpdate[];
};

export type MissingStatus = "missing" | "found";
export type DocumentationStatus =
  | "none"
  | "sent"
  | "approved"
  | "failed"
  | "inProgress";

export type LostPetUpdate = {
  date: number;
  update: number;
  status: MissingStatus;
  id: number;
  note?: string;
};

export type Colors = "black";
export type Sizes = "L" | "M/S" | "One Size";

export type CheckoutProduct = {
  availableColors?: Colors[];
  availableSizes?: Sizes[];
  description?: string;
  isAnnual?: boolean;
  img: string;
  title: string;
  price: string;
};

const PETS_LIST: PetInfo[] = [
  {
    age: "Young",
    breed: "Some Dog",
    dateOfBirth: "03/05/2024",
    id: "buddy",
    img: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
    isProtected: true,
    microchipNumber: 1290,
    missingStatus: "found",
    mixedBreed: "Yes",
    name: "Buddy",
    onboardCompleted: false,
    sex: "Male",
    spayedNeutered: false,
    species: "Dog",
    documentationStatus: "none",
    lostPetHistory: [
      {
        date: 1722300534,
        update: 1722354747,
        status: "missing",
        id: 1234567,
        note: "Lost report from submitted",
      },
      {
        date: 1722430534,
        update: 1722460747,
        status: "found",
        id: 2234567,
        note: "",
      },
    ],
  },
  {
    age: "Senior",
    breed: "Orange Cat",
    dateOfBirth: "07/07/2014",
    id: "lily",
    img: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg",
    isProtected: false,
    microchipNumber: 8645,
    missingStatus: "missing",
    mixedBreed: "No",
    name: "Lily",
    sex: "Female",
    spayedNeutered: true,
    species: "Cat",
    lostPetHistory: [
      {
        date: 1722300534,
        update: 1722354747,
        status: "missing",
        id: 1637427,
        note: "Lost report from submitted",
      },
      {
        date: 1722430534,
        update: 1722460747,
        status: "found",
        id: 2637427,
        note: "",
      },
      {
        date: 1722433434,
        update: 1722466747,
        status: "missing",
        id: 3637427,
        note: "Lost report from submitted",
      },
      {
        date: 1722430534,
        update: 1722460747,
        status: "found",
        id: 4637427,
        note: "",
      },
      {
        date: 1722433434,
        update: 1722466747,
        status: "missing",
        id: 5637427,
        note: "Lost report from submitted",
      },
      {
        date: 6,
        update: 1722460747,
        status: "found",
        id: 6637427,
        note: "",
      },
      {
        date: 7,
        update: 1722466747,
        status: "missing",
        id: 7637427,
        note: "Lost report from submitted",
      },
    ],
  },
  {
    breed: "Flufy dog",
    id: "charlie",
    img: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/top-20-small-dog-breeds.jpeg.jpg",
    isProtected: true,
    microchipNumber: 3856,
    missingStatus: "found",
    name: "Charlie",
    sex: "Male",
    spayedNeutered: true,
    species: "Dog",
    lostPetHistory: [],
  },
];

const CHECKOUT_PRODUCTS: CheckoutProduct[] = [
  {
    description:
      "Reach veterinary professionals anytime by phone, email or live chat, provided by whiskerDocs.",
    img: "https://s3-alpha-sig.figma.com/img/c719/8a55/9d54d4db8c1e404cce5823f148596ae3?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e~Gnf3K0y75CxfbL~wWj~NugWyyj0nshHZHyD-CmzpaVenkl3jthKbZCwzA73O80wKQYM-mfusjE~g4edCiJwbuHoIwIsQZlDyUg3O0NxY2XJAp25~VEmn0VikLrpB9PJvjY0txOgz4N6J2EqwbcSK2SBkXrrFoSZyS-MVWJgdVuKJTjKhEIKFcYeM37hkfagmxuDExyq-2YaFsnloM6FXigCy9zZDUDTk2O0IRTJ5e5sciQXqXWFgT~QCmmblcf9zRIfnvyiZckCAGE8XEGATqwe~dXpM-AjQfnLmB~vGuYmqztWj-qx7x5kxMU8o2sdjbQfIOXOavDlcdlk-sC4g__",
    isAnnual: true,
    price: "$24.95",
    title: "24PetMedAlert",
  },
  {
    availableColors: ["black"],
    availableSizes: ["L", "M/S"],
    img: "https://s3-alpha-sig.figma.com/img/c719/8a55/9d54d4db8c1e404cce5823f148596ae3?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e~Gnf3K0y75CxfbL~wWj~NugWyyj0nshHZHyD-CmzpaVenkl3jthKbZCwzA73O80wKQYM-mfusjE~g4edCiJwbuHoIwIsQZlDyUg3O0NxY2XJAp25~VEmn0VikLrpB9PJvjY0txOgz4N6J2EqwbcSK2SBkXrrFoSZyS-MVWJgdVuKJTjKhEIKFcYeM37hkfagmxuDExyq-2YaFsnloM6FXigCy9zZDUDTk2O0IRTJ5e5sciQXqXWFgT~QCmmblcf9zRIfnvyiZckCAGE8XEGATqwe~dXpM-AjQfnLmB~vGuYmqztWj-qx7x5kxMU8o2sdjbQfIOXOavDlcdlk-sC4g__",
    price: "$24.95",
    title: "24PetMedAlert",
  },
];

export const getPetsList = () => {
  return PETS_LIST;
};

export const getPetDocuments = ({
  petId,
  type,
}: {
  petId: string;
  type: string;
}): PetRecord[] => {
  try {
    // @ts-expect-error - ignoring mock function
    return (PET_RECORDS[petId]?.[type] as PetRecord[]) || [];
  } catch (_) {
    return [];
  }
};

export const getPetById = (id: string) => {
  return getPetsList()?.find((pet) => pet.id === id);
};

export const getPetServiceStatus = (petId: string) => {
  try {
    return PET_SERVICES[petId] || null;
  } catch (_) {
    return null;
  }
};

export const getProductsList = () => {
  return CHECKOUT_PRODUCTS;
};
