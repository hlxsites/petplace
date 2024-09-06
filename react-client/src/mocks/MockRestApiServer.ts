/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { PetRecord } from "~/components/Pet/types/PetRecordsTypes";
import { MissingStatus, PetModel } from "~/domain/models/pet/PetModel";
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

export type LostPetUpdate = {
  date: number;
  update: number;
  status: MissingStatus;
  id: number;
  note?: string;
};

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
    microchip: "8645",
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
    microchip: "3856",
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
    availableColors: ["black"],
    availableSizes: ["L", "M/S"],
    id: "bytetag-slide",
    images: [
      {
        src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IUEPMm0WipjS2BkdbVmE~4MlH3VB6qgSYnKUbO4nf~Iss-33HP3xCk22hBi0ZUWWwFLQSKvnyasGl9RQ-zxPt7x4Sj329nU015tIlODYh3QuI5PEgZ81cAu5VY2t4CRsdsjuegym-om1UKYfEmwzBaRufJCOJJqknIDxo50~fA8iEz9q16XNjA3uUOomxeO823IKcEtVb-1dRqVM3Q1k57rvrAfGQ9nz7F2vGOiVMjpCF~z2d7EcylJKN4wy~-e5mHUaifrkCGGVdTlUkoKkoM6pcAuXWAGaGQPRAbf2rLKcKmKAs--M4KerGMVdzoJ~WxTUa6rew5aoN1WofR4-Aw__",
      },
      {
        src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IUEPMm0WipjS2BkdbVmE~4MlH3VB6qgSYnKUbO4nf~Iss-33HP3xCk22hBi0ZUWWwFLQSKvnyasGl9RQ-zxPt7x4Sj329nU015tIlODYh3QuI5PEgZ81cAu5VY2t4CRsdsjuegym-om1UKYfEmwzBaRufJCOJJqknIDxo50~fA8iEz9q16XNjA3uUOomxeO823IKcEtVb-1dRqVM3Q1k57rvrAfGQ9nz7F2vGOiVMjpCF~z2d7EcylJKN4wy~-e5mHUaifrkCGGVdTlUkoKkoM6pcAuXWAGaGQPRAbf2rLKcKmKAs--M4KerGMVdzoJ~WxTUa6rew5aoN1WofR4-Aw__",
      },
      {
        src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IUEPMm0WipjS2BkdbVmE~4MlH3VB6qgSYnKUbO4nf~Iss-33HP3xCk22hBi0ZUWWwFLQSKvnyasGl9RQ-zxPt7x4Sj329nU015tIlODYh3QuI5PEgZ81cAu5VY2t4CRsdsjuegym-om1UKYfEmwzBaRufJCOJJqknIDxo50~fA8iEz9q16XNjA3uUOomxeO823IKcEtVb-1dRqVM3Q1k57rvrAfGQ9nz7F2vGOiVMjpCF~z2d7EcylJKN4wy~-e5mHUaifrkCGGVdTlUkoKkoM6pcAuXWAGaGQPRAbf2rLKcKmKAs--M4KerGMVdzoJ~WxTUa6rew5aoN1WofR4-Aw__",
      },
    ],
    price: "$19.95",
    title: "Bytetag Slide",
  },
  {
    availableColors: ["black"],
    availableSizes: ["One Size"],
    id: "bytetag-round",
    images: [
      {
        src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A2nrhMfKM3R2EBbnHwpHN6vhg9dDmBWVXlvSueb6eLM7fAoEy08ioYYLJoEOXi0sFZlCdOBLYjWcT7I0PM8SbXXvRTNh1O4YGH8X~uJrcO-67pC2lUe6hQxzmjMIrf9BYAhWijA9-3HHW-hOkCPjvUUPtLKS~QHGbUfvIkPhWxoaLCe83MylhGPEHQbDY~ti2sHJJGgHjpBysaHlZdbIkToEw-8lPWl8TOWapxovnXA5ItOB4DNA-I3SBvDjv5mSDg~4Bs0JAegBtx2MKPZRs6lGvMcElznmbtFHxz7ayHeCtOwX5Gqwiztcyn1~0xo9PN6a8v5i3xF7tCz6XyfS9A__",
      },
      {
        src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A2nrhMfKM3R2EBbnHwpHN6vhg9dDmBWVXlvSueb6eLM7fAoEy08ioYYLJoEOXi0sFZlCdOBLYjWcT7I0PM8SbXXvRTNh1O4YGH8X~uJrcO-67pC2lUe6hQxzmjMIrf9BYAhWijA9-3HHW-hOkCPjvUUPtLKS~QHGbUfvIkPhWxoaLCe83MylhGPEHQbDY~ti2sHJJGgHjpBysaHlZdbIkToEw-8lPWl8TOWapxovnXA5ItOB4DNA-I3SBvDjv5mSDg~4Bs0JAegBtx2MKPZRs6lGvMcElznmbtFHxz7ayHeCtOwX5Gqwiztcyn1~0xo9PN6a8v5i3xF7tCz6XyfS9A__",
      },
      {
        src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A2nrhMfKM3R2EBbnHwpHN6vhg9dDmBWVXlvSueb6eLM7fAoEy08ioYYLJoEOXi0sFZlCdOBLYjWcT7I0PM8SbXXvRTNh1O4YGH8X~uJrcO-67pC2lUe6hQxzmjMIrf9BYAhWijA9-3HHW-hOkCPjvUUPtLKS~QHGbUfvIkPhWxoaLCe83MylhGPEHQbDY~ti2sHJJGgHjpBysaHlZdbIkToEw-8lPWl8TOWapxovnXA5ItOB4DNA-I3SBvDjv5mSDg~4Bs0JAegBtx2MKPZRs6lGvMcElznmbtFHxz7ayHeCtOwX5Gqwiztcyn1~0xo9PN6a8v5i3xF7tCz6XyfS9A__",
      },
    ],
    price: "$19.95",
    title: "Bytetag Round",
  },
  {
    description:
      "Critical medical and behavioral information will be relayed to the shelter or vet when found.",
    id: "24-pet-med-alert",
    images: [
      {
        src: "https://s3-alpha-sig.figma.com/img/cb94/a44d/e6830c0de767f84369e5b5c46907cdb8?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kRxTKMFSnG0E4qqmCisFLte4c4NU9mY5X-EdRcM9tQNg0~zOJ9HC0aqOgmzqrWxiSjmzutuvuoN130shPIeloDaWNQxwCYWEfz0Ffwhvk9ZLaT0CgDyPx7iPSfxD81V1vyKz2n2ZLXE2nBRuz0iR5~Nk5vwjTCixbPWynFKqlQAbpleQFA0KjX-evHqnLEj97Be9kpNzXzbRFdZxqZscQJhtv7NmFgAbNCMVfZIpF8Zfh70MXPhhYDpplOppKngwiqG6BDiLiNnvuK~u4OnCLkK7Ikiq5Sjl38echWig58dmDVmumr7L5S~ZhtA-o3gf6yINfMr2kfGEEXV68Qlz0w__",
      },
    ],
    isAnnual: true,
    price: "$24.95",
    title: "24PetMedAlert®",
  },
  {
    description:
      "Reach veterinary professionals anytime by phone, email or live chat, provided by whiskerDocs.",
    id: "24-7-vet-helpline",
    images: [
      {
        src: "https://s3-alpha-sig.figma.com/img/c719/8a55/9d54d4db8c1e404cce5823f148596ae3?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e~Gnf3K0y75CxfbL~wWj~NugWyyj0nshHZHyD-CmzpaVenkl3jthKbZCwzA73O80wKQYM-mfusjE~g4edCiJwbuHoIwIsQZlDyUg3O0NxY2XJAp25~VEmn0VikLrpB9PJvjY0txOgz4N6J2EqwbcSK2SBkXrrFoSZyS-MVWJgdVuKJTjKhEIKFcYeM37hkfagmxuDExyq-2YaFsnloM6FXigCy9zZDUDTk2O0IRTJ5e5sciQXqXWFgT~QCmmblcf9zRIfnvyiZckCAGE8XEGATqwe~dXpM-AjQfnLmB~vGuYmqztWj-qx7x5kxMU8o2sdjbQfIOXOavDlcdlk-sC4g__",
      },
    ],
    isAnnual: true,
    price: "$15.00",
    title: "24/7 Vet Helpline",
  },
];

export type DetailedCartItem = {
  additionalInfo?: string;
  availableColors?: Colors[];
  availableSizes?: Sizes[];
  description: string;
  id: string;
  images: Image[];
  isAnnual?: boolean;
  name: string;
  price: string;
  privacyFeatures?: string;
  sizing?: string;
  tagFeatures?: string[];
};

export const DETAILED_CART_ITEMS: DetailedCartItem[] = [
  {
    availableColors: ["black"],
    availableSizes: ["L", "M/S"],
    name: "Bytetag Slide",
    price: "$19.95",
    description:
      "ByteTag Slide is a scannable pet tag containing all of your pets important information conveniently in one profile. The slide attaches directly to a collar.",
    id: "bytetag-slide",
    images: [
      {
        src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IUEPMm0WipjS2BkdbVmE~4MlH3VB6qgSYnKUbO4nf~Iss-33HP3xCk22hBi0ZUWWwFLQSKvnyasGl9RQ-zxPt7x4Sj329nU015tIlODYh3QuI5PEgZ81cAu5VY2t4CRsdsjuegym-om1UKYfEmwzBaRufJCOJJqknIDxo50~fA8iEz9q16XNjA3uUOomxeO823IKcEtVb-1dRqVM3Q1k57rvrAfGQ9nz7F2vGOiVMjpCF~z2d7EcylJKN4wy~-e5mHUaifrkCGGVdTlUkoKkoM6pcAuXWAGaGQPRAbf2rLKcKmKAs--M4KerGMVdzoJ~WxTUa6rew5aoN1WofR4-Aw__",
        alt: "Bytetag Slide 1",
      },
      {
        src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IUEPMm0WipjS2BkdbVmE~4MlH3VB6qgSYnKUbO4nf~Iss-33HP3xCk22hBi0ZUWWwFLQSKvnyasGl9RQ-zxPt7x4Sj329nU015tIlODYh3QuI5PEgZ81cAu5VY2t4CRsdsjuegym-om1UKYfEmwzBaRufJCOJJqknIDxo50~fA8iEz9q16XNjA3uUOomxeO823IKcEtVb-1dRqVM3Q1k57rvrAfGQ9nz7F2vGOiVMjpCF~z2d7EcylJKN4wy~-e5mHUaifrkCGGVdTlUkoKkoM6pcAuXWAGaGQPRAbf2rLKcKmKAs--M4KerGMVdzoJ~WxTUa6rew5aoN1WofR4-Aw__",
        alt: "Bytetag Slide 2",
      },
      {
        src: "https://s3-alpha-sig.figma.com/img/c4cf/8d14/97efcac85020a015f873858bde3111ad?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IUEPMm0WipjS2BkdbVmE~4MlH3VB6qgSYnKUbO4nf~Iss-33HP3xCk22hBi0ZUWWwFLQSKvnyasGl9RQ-zxPt7x4Sj329nU015tIlODYh3QuI5PEgZ81cAu5VY2t4CRsdsjuegym-om1UKYfEmwzBaRufJCOJJqknIDxo50~fA8iEz9q16XNjA3uUOomxeO823IKcEtVb-1dRqVM3Q1k57rvrAfGQ9nz7F2vGOiVMjpCF~z2d7EcylJKN4wy~-e5mHUaifrkCGGVdTlUkoKkoM6pcAuXWAGaGQPRAbf2rLKcKmKAs--M4KerGMVdzoJ~WxTUa6rew5aoN1WofR4-Aw__",
        alt: "Bytetag Slide 3",
      },
    ],
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
    availableColors: ["black"],
    availableSizes: ["One Size"],
    name: "Bytetag Round",
    price: "$19.95",
    description:
      "ByteTag Round is a scannable pet tag containing all of your pets important information conveniently in one profile.",
    id: "bytetag-round",
    images: [
      {
        src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A2nrhMfKM3R2EBbnHwpHN6vhg9dDmBWVXlvSueb6eLM7fAoEy08ioYYLJoEOXi0sFZlCdOBLYjWcT7I0PM8SbXXvRTNh1O4YGH8X~uJrcO-67pC2lUe6hQxzmjMIrf9BYAhWijA9-3HHW-hOkCPjvUUPtLKS~QHGbUfvIkPhWxoaLCe83MylhGPEHQbDY~ti2sHJJGgHjpBysaHlZdbIkToEw-8lPWl8TOWapxovnXA5ItOB4DNA-I3SBvDjv5mSDg~4Bs0JAegBtx2MKPZRs6lGvMcElznmbtFHxz7ayHeCtOwX5Gqwiztcyn1~0xo9PN6a8v5i3xF7tCz6XyfS9A__",
        alt: "Bytetag Round 1",
      },
      {
        src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A2nrhMfKM3R2EBbnHwpHN6vhg9dDmBWVXlvSueb6eLM7fAoEy08ioYYLJoEOXi0sFZlCdOBLYjWcT7I0PM8SbXXvRTNh1O4YGH8X~uJrcO-67pC2lUe6hQxzmjMIrf9BYAhWijA9-3HHW-hOkCPjvUUPtLKS~QHGbUfvIkPhWxoaLCe83MylhGPEHQbDY~ti2sHJJGgHjpBysaHlZdbIkToEw-8lPWl8TOWapxovnXA5ItOB4DNA-I3SBvDjv5mSDg~4Bs0JAegBtx2MKPZRs6lGvMcElznmbtFHxz7ayHeCtOwX5Gqwiztcyn1~0xo9PN6a8v5i3xF7tCz6XyfS9A__",
        alt: "Bytetag Round 2",
      },
      {
        src: "https://s3-alpha-sig.figma.com/img/a0c0/b99c/8b8cd8f37db6ba72ab310687efc5203d?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A2nrhMfKM3R2EBbnHwpHN6vhg9dDmBWVXlvSueb6eLM7fAoEy08ioYYLJoEOXi0sFZlCdOBLYjWcT7I0PM8SbXXvRTNh1O4YGH8X~uJrcO-67pC2lUe6hQxzmjMIrf9BYAhWijA9-3HHW-hOkCPjvUUPtLKS~QHGbUfvIkPhWxoaLCe83MylhGPEHQbDY~ti2sHJJGgHjpBysaHlZdbIkToEw-8lPWl8TOWapxovnXA5ItOB4DNA-I3SBvDjv5mSDg~4Bs0JAegBtx2MKPZRs6lGvMcElznmbtFHxz7ayHeCtOwX5Gqwiztcyn1~0xo9PN6a8v5i3xF7tCz6XyfS9A__",
        alt: "Bytetag Round 3",
      },
    ],
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
    name: "24PetMedAlert®",
    price: "$24.95",
    id: "24-pet-med-alert",
    images: [
      {
        src: "https://s3-alpha-sig.figma.com/img/cb94/a44d/e6830c0de767f84369e5b5c46907cdb8?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kRxTKMFSnG0E4qqmCisFLte4c4NU9mY5X-EdRcM9tQNg0~zOJ9HC0aqOgmzqrWxiSjmzutuvuoN130shPIeloDaWNQxwCYWEfz0Ffwhvk9ZLaT0CgDyPx7iPSfxD81V1vyKz2n2ZLXE2nBRuz0iR5~Nk5vwjTCixbPWynFKqlQAbpleQFA0KjX-evHqnLEj97Be9kpNzXzbRFdZxqZscQJhtv7NmFgAbNCMVfZIpF8Zfh70MXPhhYDpplOppKngwiqG6BDiLiNnvuK~u4OnCLkK7Ikiq5Sjl38echWig58dmDVmumr7L5S~ZhtA-o3gf6yINfMr2kfGEEXV68Qlz0w__",
      },
    ],
    isAnnual: true,
    description:
      "If your pet is lost and then brought to a shelter or vet, we are able to share all important information about them. This information may make all the difference to the care your pet.",
    additionalInfo:
      "Your first year is complimentary with a Lifetime Protection Membership.",
  },
  {
    name: "24/7 Vet Helpline",
    price: "$15.00",
    id: "24-7-vet-helpline",
    images: [
      {
        src: "https://s3-alpha-sig.figma.com/img/c719/8a55/9d54d4db8c1e404cce5823f148596ae3?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lW51xy4dfqkyDi4jWruiI0Rv3-yC6GnRD0SOQmquxSuBwM~zS7cxfkxF8j59D9fRXo0Y-YrlJY~R8aAFkqN3~N9iDY8d9mdRFu-W15ABxAXr464cpjpE3zOBxR~bflQn0EfQlFBEDhXa8HrTCo31ABzX246eGN5J8VMnzLHh4moYisdqsuyMsPsdJqQUOkg8IVnYlfRSQnQIJkLQ2kTT2c7J4kgkOsPbC0eb-pyAjX42Bhw35A483SarFdDkyhg1v0lJOSYALXKJaBfzJzYA9K1DY0b5gUGbXB-wYsYs5SIV4zbC7QKrr7PxAifMgjH8Y6v-oQ0usVzWwqW2yhF2eA__",
      },
    ],
    isAnnual: true,
    description:
      "Contact a veterinary professional any time or day by phone, email or live chat.",
    additionalInfo:
      "Your first year is complimentary with a Lifetime Protection Membership.",
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
  return getPetsList()?.find((pet) => pet.id === id) || getPetsList()[0];
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

export const getProductById = (id: string | null) => {
  return DETAILED_CART_ITEMS.find((pet) => pet.id === id);
};
