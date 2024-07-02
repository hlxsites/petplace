import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoutePaths } from "./AppRoutePaths";
import { Root } from "./root";
import { RootErrorPage } from "./root-error-page";

const routes = [
  {
    path: AppRoutePaths.root,
    element: <Root />,
    errorElement: <RootErrorPage />,
  },
];

const router = createBrowserRouter(routes, {
  basename: "/account",
});

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />;
};
