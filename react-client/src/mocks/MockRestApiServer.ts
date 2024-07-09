const PETS_LIST = [
  {
    id: "buddy",
    name: "Buddy",
    img: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
    isProtected: true,
  },
  {
    id: "max",
    name: "Max",
    img: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg",
    isProtected: false,
  },
  {
    id: "charlie",
    name: "Charlie",
    img: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/top-20-small-dog-breeds.jpeg.jpg",
    isProtected: true,
  },
];

export const getPetsList = () => {
  return PETS_LIST;
};
