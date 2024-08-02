export type PetInfo = {
  age?: string | undefined;
  breed?: string;
  dateOfBirth?: string;
  id: string;
  img?: string;
  mixedBreed?: string;
  isProtected?: boolean;
  microchipNumber?: number;
  name: string;
  sex?: string;
  spayedNeutered?: string;
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
    spayedNeutered: "No",
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
    spayedNeutered: "Yes",
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
    spayedNeutered: "Yes",
    species: "Dog",
    lostPetHistory: [],
  },
];

export const getPetsList = () => {
  return PETS_LIST;
};
export const getPetById = (id: string) => {
  return getPetsList()?.find((pet) => pet.id === id);
};
