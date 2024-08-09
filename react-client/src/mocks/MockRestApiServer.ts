/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";

// downloadPath?: string;
//   fileName: string;
//   fileType?:

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
  sex?: string;
  spayedNeutered?: boolean;
  species?: string;
  missingStatus?: MissingStatus;
  lostPetHistory?: LostPetUpdate[];
};

export type MissingStatus = "missing" | "found";

export type LostPetUpdate = {
  date: number;
  update: number;
  status: MissingStatus;
  id: number;
  note?: string;
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
    sex: "Male",
    spayedNeutered: false,
    species: "Dog",
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
    return (PET_RECORDS?.[petId]?.[type] as PetRecord[]) || [];
  } catch (_) {
    return [];
  }
};

export const getPetById = (id: string) => {
  return getPetsList()?.find((pet) => pet.id === id);
};
