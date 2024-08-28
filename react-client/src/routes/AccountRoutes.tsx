import isEqual from "lodash/isEqual";
import { AddNewPetIndex } from "./add-pet/AddNewPetIndex";
import { loader as AddNewPetIndexLoader } from "./add-pet/useAddNewPetIndexViewModel";
import { AppRoutePaths } from "./AppRoutePaths";
import { MyPetsIndex } from "./my-pets/MyPetsIndex";
import { PetProfileIndex } from "./my-pets/petId/PetProfileIndex";
import { loader as PetProfileLayoutLoader } from "./my-pets/petId/usePetProfileLayoutViewModel";
import { loader as MyPetsIndexLoader } from "./my-pets/useMyPetsIndexViewModel";
import { Root } from "./root";
import { RootErrorPage } from "./root-error-page";
import { PetPlaceRouteObject } from "./types/routerTypes";

import { FoundPetIndex } from "./found-pet/FoundPetIndex";
import { LostPetIndex } from "./lost-pet/LostPetIndex";
import { loader as LostPetIndexLoader } from "./lost-pet/useLostPetIndexViewModel";
import { DocumentTypeIndex } from "./my-pets/petId/documents/documentType/DocumentTypeIndex";
import { loader as DocumentTypeIndexLoader } from "./my-pets/petId/documents/documentType/useDocumentTypeIndexViewModel";
import { PetEditIndex } from "./my-pets/petId/edit/PetEditIndex";
import { PetProfileLayout } from "./my-pets/petId/PetProfileLayout";

export const accountRoutes: PetPlaceRouteObject[] = [
  {
    id: "root",
    path: AppRoutePaths.root,
    element: <Root />,
    errorElement: <RootErrorPage />,
    children: [
      {
        id: "myPets",
        path: AppRoutePaths.myPets,
        children: [
          {
            id: "myPetsIndex",
            index: true,
            loader: MyPetsIndexLoader,
            shouldRevalidate: ({ currentParams, nextParams }) =>
              !isEqual(currentParams, nextParams),
            element: <MyPetsIndex />,
          },
          {
            element: <PetProfileLayout />,
            id: "petProfile",
            loader: PetProfileLayoutLoader,
            path: AppRoutePaths.petProfile,
            shouldRevalidate: ({ currentParams, nextParams }) =>
              !isEqual(currentParams, nextParams),
            children: [
              {
                element: <PetProfileIndex />,
                id: "petProfileIndex",
                index: true,
              },
              {
                id: "petProfileDocuments",
                path: AppRoutePaths.petProfileDocuments,
                element: <PetProfileIndex />,
                children: [
                  {
                    id: "petProfileDocumentType",
                    loader: DocumentTypeIndexLoader,
                    path: AppRoutePaths.petProfileDocumentType,
                    element: <DocumentTypeIndex />,
                  },
                ],
              },
              {
                id: "petEdit",
                path: AppRoutePaths.petEdit,
                element: <PetEditIndex />,
              },
            ],
          },
          {
            id: "addNewPet",
            path: AppRoutePaths.addNewPet,
            children: [
              {
                id: "addNewPetIndex",
                index: true,
                loader: AddNewPetIndexLoader,
                shouldRevalidate: ({ currentParams, nextParams }) =>
                  !isEqual(currentParams, nextParams),
                element: <AddNewPetIndex />,
              },
            ],
          },
        ],
      },
      {
        element: <LostPetIndex />,
        id: "lostPet",
        path: AppRoutePaths.lostPet,
        loader: LostPetIndexLoader,
        shouldRevalidate: ({ currentParams, nextParams }) =>
          !isEqual(currentParams, nextParams),
      },
      {
        element: <FoundPetIndex />,
        id: "foundPet",
        path: AppRoutePaths.foundPet,
      },
    ],
  },
];
