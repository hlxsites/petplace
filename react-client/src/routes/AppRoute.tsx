import isEqual from "lodash/isEqual";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AddNewPetIndex } from "./add-pet/AddNewPetIndex";
import { loader as AddNewPetIndexLoader } from "./add-pet/useAddNewPetIndexViewModel";
import { AppRoutePaths } from "./AppRoutePaths";
import { PetProfileIndex } from "./my-pets/:petId/PetProfileIndex";
import { loader as PetProfileLayoutLoader } from "./my-pets/:petId/usePetProfileLayoutViewModel";
import { MyPetsIndex } from "./my-pets/MyPetsIndex";
import { loader as MyPetsIndexLoader } from "./my-pets/useMyPetsIndexViewModel";
import { Root } from "./root";
import { RootErrorPage } from "./root-error-page";
import { PetPlaceRouteObject } from "./types/routerTypes";

import { lazy } from "react";
import { APP_BASE_URL, IS_DEV_ENV } from "~/util/envUtil";
import { DocumentTypeIndex } from "./my-pets/:petId/documents/:documentType/DocumentTypeIndex";
import { loader as DocumentTypeIndexLoader } from "./my-pets/:petId/documents/:documentType/useDocumentTypeIndexViewModel";
import { PetEditIndex } from "./my-pets/:petId/edit/PetEditIndex";
import { PetProfileLayout } from "./my-pets/:petId/PetProfileLayout";
import { CheckoutIndex } from "./checkout/CheckoutIndex";
import { loader as CheckoutIndexLoader } from "./checkout/useCheckoutIndexViewModel";

const PlaygroundPage = lazy(() => import("./playground/PlaygroundIndex"));

const routes: PetPlaceRouteObject[] = [
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
        id: "checkout",
        path: AppRoutePaths.checkout,
        children: [
          {
            id: "checkoutIndex",
            index: true,
            loader: CheckoutIndexLoader,
            shouldRevalidate: ({ currentParams, nextParams }) =>
              !isEqual(currentParams, nextParams),
            element: <CheckoutIndex />,
          },
        ],
      },
    ],
  },
];

// We don't want to include the playground route in production
if (IS_DEV_ENV) {
  const playgroundRoute: PetPlaceRouteObject = {
    id: "playground",
    path: AppRoutePaths.playground,
    children: [
      {
        id: "playgroundIndex",
        element: <PlaygroundPage />,
        index: true,
      },
    ],
  };

  routes.push(playgroundRoute);
}

const router = createBrowserRouter(routes, {
  basename: APP_BASE_URL,
});

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />;
};
