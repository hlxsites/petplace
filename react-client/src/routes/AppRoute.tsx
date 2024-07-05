import isEqual from "lodash/isEqual";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PetPlaceRouteObject } from "~/types/routerTypes";
import { AppRoutePaths } from "./AppRoutePaths";
import { MyPetsIndex } from "./my-pets/MyPetsIndex";
import { loader as MyPetsIndexLoader } from "./my-pets/useMyPetsIndexViewModel";
import { PetProfileIndex } from "./pet-profile/PetProfileIndex";
import { loader as PetProfileIndexLoader } from "./pet-profile/usePetProfileIndexViewModel";
import { RootErrorPage } from "./root-error-page";

const routes: PetPlaceRouteObject[] = [
  {
    id: "root",
    path: AppRoutePaths.root,
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
