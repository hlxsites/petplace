export type PetInfo = {
  breed?: string;
  id: string;
  img?: string;
  isProtected?: boolean;
  microchipNumber?: number;
  name: string;
  sex?: string;
};

const PETS_LIST: PetInfo[] = [
  {
    breed: "Some Dog",
    id: "buddy",
    img: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
    isProtected: true,
    microchipNumber: 1290,
    name: "Buddy",
    sex: "Male",
  },
  {
    breed: "Orange Cat",
    id: "lily",
    img: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg",
    isProtected: false,
    microchipNumber: 8645,
    name: "Lily",
    sex: "Female",
  },
  {
    breed: "Flufy dog",
    id: "charlie",
    img: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/top-20-small-dog-breeds.jpeg.jpg",
    isProtected: true,
    microchipNumber: 3856,
    name: "Charlie",
    sex: "Male",
  },
];

export const getPetsList = () => {
  return PETS_LIST;
};
