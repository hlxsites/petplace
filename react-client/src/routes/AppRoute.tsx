import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PetPlaceRouteObject } from "~/types/routerTypes";
import { AppRoutePaths } from "./AppRoutePaths";
import { MyPetsIndex } from "./my-pets/MyPetsIndex";
import { Root } from "./root";
import { RootErrorPage } from "./root-error-page";
import { PetProfileIndex } from "./pet-profile/PetProfileIndex";

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
            element: <MyPetsIndex />,
          },
        ],
      },
      {
        id: "petProfile",
        path: AppRoutePaths.petProfile,
        children: [
          {
            id: "petProfileIndex",
            index: true,
            element: <PetProfileIndex />,
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
