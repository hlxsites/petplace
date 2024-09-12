/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";
import {
  LostPetUpdate,
  MissingStatus,
  PetModel,
} from "~/domain/models/pet/PetModel";
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
  mixedBreed?: boolean;
  name: string;
  onboardCompleted?: boolean;
  sex?: string;
  spayedNeutered?: boolean;
  species?: string;
  documentationStatus?: DocumentationStatus;
  missingStatus?: MissingStatus;
  lostPetHistory?: LostPetUpdate[];
};

export type DocumentationStatus =
  | "none"
  | "sent"
  | "approved"
  | "failed"
  | "inProgress";

export type Colors = "black";
export type Sizes = "L" | "M/S" | "One Size";
export type Image = { src: string; alt?: string };

export type CheckoutProduct = {
  availableColors?: Colors[];
  availableSizes?: Sizes[];
  description?: string;
  id: string;
  isAnnual?: boolean;
  images: Image[];
  title: string;
  price: string;
};

const PETS_LIST: PetModel[] = [
  {
    age: "Young",
    breed: "Some Dog",
    dateOfBirth: "03/05/2024",
    id: "buddy",
    img: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
    isProtected: true,
    microchip: "1290",
    missingStatus: "found",
    mixedBreed: false,
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
        date: 628021800000,
        update: 1722460747,
        status: "found",
        id: 2234567,
        note: "",
        foundedBy: {
          finderName: "Erica Wong",
          contact: [
            {
              date: 1722430534,
              methodContact: "Phone Call",
              phoneNumber: "289-218-6754",
            },
            {
              date: 1722430534,
              methodContact: "Text Message",
              phoneNumber: "289-218-6754",
            },
            {
              date: 1722430534,
              methodContact: "Email",
              email: "dana.rayman@pethealthinc.com",
            },
          ],
        },
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
    microchip: "8645",
    missingStatus: "missing",
    mixedBreed: true,
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
        foundedBy: {
          finderName: "Erica Wong",
          contact: [
            {
              date: 1722430534,
              methodContact: "Phone Call",
              phoneNumber: "289-218-6754",
            },
            {
              date: 1722430534,
              methodContact: "Text Message",
              phoneNumber: "289-218-6754",
            },
            {
              date: 1722430534,
              methodContact: "Email",
              email: "dana.rayman@pethealthinc.com",
            },
          ],
        },
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
        foundedBy: null,
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
    microchip: "3856",
    missingStatus: "found",
    name: "Charlie",
    sex: "Male",
    spayedNeutered: true,
    species: "Dog",
    lostPetHistory: [],
  },
];

const BytetagSlide: CheckoutProduct = {
  availableColors: ["black"],
  availableSizes: ["L", "M/S"],
  id: "bytetag-slide",
  images: [
    {
      src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zvh7WpDTn3gR4~rNk8H-or6i9FY7czQkt6Qql2dw7vfX8ireRW1b4JsWH5wIqOoctTucZIr2VsXUTXZCAXwhRyhDPfZlv5~ptuQTHz7ktbgFPyxeUbm5NA8OczUseuaCIMZAah1~GQCr-jfSAyKGnnhgvt70ENihgFF1Ttnz-8oeOavz4e6qBLJMf1G2RlbtL9by9-w2XyvbBW2QkKegpyya5l~2GUkyXK0fioDahYHzIJl4d~prUFJYbHDeFkQBAitcfug1njg7byfib0ABFRVs5~3OPjmmeikHBHz3awpljBBL-9dmrCRcBEe6cpKu6sTsFMzglPAVTrjS22W0aQ__",
    },
    {
      src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zvh7WpDTn3gR4~rNk8H-or6i9FY7czQkt6Qql2dw7vfX8ireRW1b4JsWH5wIqOoctTucZIr2VsXUTXZCAXwhRyhDPfZlv5~ptuQTHz7ktbgFPyxeUbm5NA8OczUseuaCIMZAah1~GQCr-jfSAyKGnnhgvt70ENihgFF1Ttnz-8oeOavz4e6qBLJMf1G2RlbtL9by9-w2XyvbBW2QkKegpyya5l~2GUkyXK0fioDahYHzIJl4d~prUFJYbHDeFkQBAitcfug1njg7byfib0ABFRVs5~3OPjmmeikHBHz3awpljBBL-9dmrCRcBEe6cpKu6sTsFMzglPAVTrjS22W0aQ__",
    },
    {
      src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zvh7WpDTn3gR4~rNk8H-or6i9FY7czQkt6Qql2dw7vfX8ireRW1b4JsWH5wIqOoctTucZIr2VsXUTXZCAXwhRyhDPfZlv5~ptuQTHz7ktbgFPyxeUbm5NA8OczUseuaCIMZAah1~GQCr-jfSAyKGnnhgvt70ENihgFF1Ttnz-8oeOavz4e6qBLJMf1G2RlbtL9by9-w2XyvbBW2QkKegpyya5l~2GUkyXK0fioDahYHzIJl4d~prUFJYbHDeFkQBAitcfug1njg7byfib0ABFRVs5~3OPjmmeikHBHz3awpljBBL-9dmrCRcBEe6cpKu6sTsFMzglPAVTrjS22W0aQ__",
    },
  ],
  price: "$19.95",
  title: "Bytetag Slide",
};

const BytetagRound: CheckoutProduct = {
  availableColors: ["black"],
  availableSizes: ["One Size"],
  id: "bytetag-round",
  images: [
    {
      src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=paLS581ralWdhfWzR4BOCY13BCYZMedTE9KHiTEYkmvriACOdBLCaF-7-pCNgMSL8WvOtiQCVnXpA3DyRfRXqYP7PzIvFVKXDecfstJVnA~i8EFjI2Ct~WK20sJWCBucQZ5z00Bv25UXs3zYJxr2YOn6bcQu7G71F0H~MhYf9eZdsSUcRGWEitZ9FKOA~m0snAuLbhBUPkebWqbUQKRXF7uZenZMnay2yFiSymlDt5iHcYSAOH1LvG5vSDgSOTku0-buODUvc8zFWf1aLmc4UUtO~MRzwjaYIwk3elaDNCMlCrMyD9WanAtk-NFD8ucrshW5RbDigCUrn3MLL1skZg__",
    },
    {
      src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=paLS581ralWdhfWzR4BOCY13BCYZMedTE9KHiTEYkmvriACOdBLCaF-7-pCNgMSL8WvOtiQCVnXpA3DyRfRXqYP7PzIvFVKXDecfstJVnA~i8EFjI2Ct~WK20sJWCBucQZ5z00Bv25UXs3zYJxr2YOn6bcQu7G71F0H~MhYf9eZdsSUcRGWEitZ9FKOA~m0snAuLbhBUPkebWqbUQKRXF7uZenZMnay2yFiSymlDt5iHcYSAOH1LvG5vSDgSOTku0-buODUvc8zFWf1aLmc4UUtO~MRzwjaYIwk3elaDNCMlCrMyD9WanAtk-NFD8ucrshW5RbDigCUrn3MLL1skZg__",
    },
    {
      src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=paLS581ralWdhfWzR4BOCY13BCYZMedTE9KHiTEYkmvriACOdBLCaF-7-pCNgMSL8WvOtiQCVnXpA3DyRfRXqYP7PzIvFVKXDecfstJVnA~i8EFjI2Ct~WK20sJWCBucQZ5z00Bv25UXs3zYJxr2YOn6bcQu7G71F0H~MhYf9eZdsSUcRGWEitZ9FKOA~m0snAuLbhBUPkebWqbUQKRXF7uZenZMnay2yFiSymlDt5iHcYSAOH1LvG5vSDgSOTku0-buODUvc8zFWf1aLmc4UUtO~MRzwjaYIwk3elaDNCMlCrMyD9WanAtk-NFD8ucrshW5RbDigCUrn3MLL1skZg__",
    },
  ],
  price: "$19.95",
  title: "Bytetag Round",
};

const PetMedAlert: CheckoutProduct = {
  description:
    "Critical medical and behavioral information will be relayed to the shelter or vet when found.",
  id: "24-pet-med-alert",
  images: [
    {
      src: "https://s3-alpha-sig.figma.com/img/cb94/a44d/e6830c0de767f84369e5b5c46907cdb8?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aYDsLbTvIb5i01fZHnE65t56q1IYHDp8jI4b7cndDG~lBiYYrwgLfCezOUa4mSGPO-d2C7ybRXPcpmIqK2vdGAUJkBEUNkCIO6fuB~c-nbwRF0QtrHRAi98I-K5mK-cLANw~Hw~WSfkCwISFLF5v6V8cU-JBR1~24uw64YOQkAz3tPY6wdtYRXiU-7LIKUo99vUR0ZqPq7NZ55y1XIBe677dSIcUTYXJlJ6AYgjkecyDGLulroojAn~tI3MUW8GpRVb5a45RD4SHRc-pAGyDd~~pV2aCoHXzLIQ-ll6Z89C18S5NNIpM8OSP15BSgFCH0kK1uDFJl5zscBZuCnQOjQ__",
    },
  ],
  isAnnual: true,
  price: "$24.95",
  title: "24PetMedAlert®",
};

const VetHelpline: CheckoutProduct = {
  description:
    "Reach veterinary professionals anytime by phone, email or live chat, provided by whiskerDocs.",
  id: "24-7-vet-helpline",
  images: [
    {
      src: "https://s3-alpha-sig.figma.com/img/c719/8a55/9d54d4db8c1e404cce5823f148596ae3?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dIhEvEaiOY99w5B4u8REdKfFXgYJV6Jl~EVS-TqnZd43ej3vcJg31MVduSf8M6bUzvjv3inSIzKFnzR~ZuDLMufz8MiNi8I4Ar9cGbufLw1~g-YziRJpf2z4ASxfpGnSru2FKqwu6yNpS3EI9hA~7vkfxB12MmJZXcMdF6n-El97ykP8kMit5TlvWZpXDBpa4ertM0X6aBkmGdEDs98ZICZwEu-PqQwa1khaX7ddQdJKGOPNaZcMJrgT3iA-OoAueykHRKQdD9KlrvCJinA0nUROAkQ6bwZwVlJfhst79jTwqKdzMX3DqX3RKR9eyUh~ko0bMUu60lTY2W5PDIqpDw__",
    },
  ],
  isAnnual: true,
  price: "$15.00",
  title: "24/7 Vet Helpline",
};

const CHECKOUT_PRODUCTS: CheckoutProduct[] = [
  BytetagSlide,
  BytetagRound,
  PetMedAlert,
  VetHelpline,
];

export type DetailedCartItem = CheckoutProduct & {
  additionalInfo?: string;
  privacyFeatures?: string;
  sizing?: string;
  tagFeatures?: string[];
};

export const DETAILED_CART_ITEMS: DetailedCartItem[] = [
  {
    ...BytetagSlide,
    sizing: "Small: 7.7cm x 1.3cm | Large: 8.1cm x 2cm",
    privacyFeatures:
      "You can choose to hide your phone number and address from your pet's profile until your pet has been marked as lost.",
    tagFeatures: [
      "Waterproof",
      "Scratch, bite, and fade resistant",
      "Light weight and jingle free",
      "No batteries needed",
      "Compatible with all smartphones",
      "No monthly fee",
      "Can be used anywhere and anytime",
    ],
  },
  {
    ...BytetagRound,
    sizing: "Small: 7.7cm x 1.3cm | Large: 8.1cm x 2cm",
    privacyFeatures:
      "You can choose to hide your phone number and address from your pet's profile until your pet has been marked as lost.",
    tagFeatures: [
      "Waterproof",
      "Scratch, bite, and fade resistant",
      "Light weight and jingle free",
      "No batteries needed",
      "Compatible with all smartphones",
      "No monthly fee",
      "Can be used anywhere and anytime",
    ],
  },
  {
    ...PetMedAlert,
    additionalInfo:
      "Your first year is complimentary with a Lifetime Protection Membership.",
  },
  {
    ...VetHelpline,
    additionalInfo:
      "Your first year is complimentary with a Lifetime Protection Membership.",
  },
];

export type CheckoutServices = {
  title: string;
  price: string;
  id: string;
  description: string;
  isAnnual?: boolean;
  images: Image[];
};

const CHECKOUT_SERVICES: CheckoutServices[] = [
  PetMedAlert as CheckoutServices,
  VetHelpline as CheckoutServices,
];

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
  return PETS_LIST.find((pet) => pet.id === id) || PETS_LIST[0];
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

export const getServicesList = () => {
  return CHECKOUT_SERVICES;
};

export const getProductById = (id: string | null) => {
  return DETAILED_CART_ITEMS.find((pet) => pet.id === id);
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

export const getAuthLogin = () => {
  return true;
};
