import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";

export type Record = {
  medicalRecords?: PetRecord[];
  otherDocuments?: PetRecord[];
  tests?: PetRecord[];
  vaccines?: PetRecord[];
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
  records?: Record;
  sex?: string;
  spayedNeutered?: string;
  species?: string;
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
    mixedBreed: "Yes",
    name: "Buddy",
    records: {},
    sex: "Male",
    spayedNeutered: "No",
    species: "Dog",
  },
  {
    age: "Senior",
    breed: "Orange Cat",
    dateOfBirth: "07/07/2014",
    id: "lily",
    img: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg",
    isProtected: false,
    microchipNumber: 8645,
    mixedBreed: "No",
    name: "Lily",
    records: {
      medicalRecords: [],
      otherDocuments: [
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
    sex: "Female",
    spayedNeutered: "Yes",
    species: "Cat",
  },
  {
    breed: "Flufy dog",
    id: "charlie",
    img: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/top-20-small-dog-breeds.jpeg.jpg",
    isProtected: true,
    microchipNumber: 3856,
    name: "Charlie",
    sex: "Male",
    spayedNeutered: "Yes",
    species: "Dog",
  },
];

export const getPetsList = () => {
  return PETS_LIST;
};

export const getPetById = (id: string) => {
  return getPetsList()?.find((pet) => pet.id === id);
};
