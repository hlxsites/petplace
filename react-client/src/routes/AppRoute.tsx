import isEqual from "lodash/isEqual";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PetPlaceRouteObject } from "~/types/routerTypes";
import { AppRoutePaths } from "./AppRoutePaths";
import { MyPetsIndex } from "./my-pets/MyPetsIndex";
import { PetProfileIndex } from "./pet-profile/PetProfileIndex";
import { AddNewPetIndex } from "./add-pet/AddNewPetIndex";
import { loader as MyPetsIndexLoader } from "./my-pets/useMyPetsIndexViewModel";
import { loader as PetProfileIndexLoader } from "./pet-profile/usePetProfileIndexViewModel";
import { loader as AddNewPetIndexLoader } from "./add-pet/useAddNewPetIndexViewModel";
import { Root } from "./root";
import { RootErrorPage } from "./root-error-page";

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
            id: "petProfile",
            path: AppRoutePaths.petProfile,
            children: [
              {
                id: "petProfileIndex",
                index: true,
                loader: PetProfileIndexLoader,
                shouldRevalidate: ({ currentParams, nextParams }) =>
                  !isEqual(currentParams, nextParams),
                element: <PetProfileIndex />,
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
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: "/account",
});

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />;
};
