import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PetPlaceRouteObject } from "~/types/routerTypes";
import { AppRoutePaths } from "./AppRoutePaths";
import { MyPetsIndex } from "./my-pets/MyPetsIndex";
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
            element: <MyPetsIndex />,
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
