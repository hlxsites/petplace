import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { loader as AccountIndexLoader } from "./account/useAccountIndexViewModel";
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

import { lazy } from "react";
import { IS_DEV_ENV } from "~/util/envUtil";
import { AccountIndex } from "./account/AccountIndex";
import { AccountRoot } from "./account/AccountRoot";
import { CheckoutIndex } from "./checkout/CheckoutIndex";
import { ProductsIndex } from "./checkout/products/ProductsIndex";
import { loader as CheckoutIndexLoader } from "./checkout/useCheckoutIndexViewModel";
import { FoundPetIndex } from "./found-pet/FoundPetIndex";
import { LostPetIndex } from "./lost-pet/LostPetIndex";
import { loader as LostPetIndexLoader } from "./lost-pet/useLostPetIndexViewModel";
import { MyPetsLayout } from "./my-pets/MyPetsLayout";
import { DocumentTypeIndex } from "./my-pets/petId/documents/documentType/DocumentTypeIndex";
import { loader as DocumentTypeIndexLoader } from "./my-pets/petId/documents/documentType/useDocumentTypeIndexViewModel";
import { PetEditIndex } from "./my-pets/petId/edit/PetEditIndex";
import { PetProfileLayout } from "./my-pets/petId/PetProfileLayout";

const PlaygroundPage = lazy(() => import("./playground/PlaygroundIndex"));

const routes: PetPlaceRouteObject[] = [
  {
    id: "root",
    path: AppRoutePaths.root,
    element: <Root />,
    errorElement: <RootErrorPage />,
    children: [
      {
        element: <AccountRoot />,
        id: "account",
        loader: AccountIndexLoader,
        path: AppRoutePaths.account,
        children: [
          {
            element: <AccountIndex />,
            id: "accountIndex",
            index: true,
          },
          {
            id: "accountNotifications",
            path: AppRoutePaths.accountNotifications,
            element: <AccountIndex />,
          },
          {
            id: "accountPayment",
            path: AppRoutePaths.accountPayment,
            element: <AccountIndex />,
          },
        ],
      },
      {
        element: <MyPetsLayout />,
        id: "myPets",
        // @ts-expect-error - this is a valid path but TS doesn't know it
        path: `${AppRoutePaths.account}/${AppRoutePaths.myPets}`,
        children: [
          {
            id: "myPetsIndex",
            index: true,
            loader: MyPetsIndexLoader,
            element: <MyPetsIndex />,
          },
          {
            element: <PetProfileLayout />,
            id: "petProfile",
            loader: PetProfileLayoutLoader,
            path: AppRoutePaths.petProfile,
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
      },
      {
        element: <FoundPetIndex />,
        id: "foundPet",
        path: AppRoutePaths.foundPet,
      },
      {
        id: "checkout",
        path: AppRoutePaths.checkout,
        children: [
          {
            id: "checkoutIndex",
            index: true,
            loader: CheckoutIndexLoader,
            element: <CheckoutIndex />,
          },
          {
            id: "products",
            element: <ProductsIndex />,
            // fix the loader when discover if products will be available via API or hardcoded
            loader: CheckoutIndexLoader,
            path: AppRoutePaths.products,
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

const router = createBrowserRouter(routes);

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />;
};
