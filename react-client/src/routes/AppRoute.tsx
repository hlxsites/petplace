import { lazy, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { accountRoutes } from "./AccountRoutes";
import { checkoutRoutes } from "./CheckoutRoutes";

import {
  ACCOUNT_BASE_URL,
  CHECKOUT_BASE_URL,
  IS_DEV_ENV,
} from "~/util/envUtil";
import { AppRoutePaths } from "./AppRoutePaths";
import { PetPlaceRouteObject } from "./types/routerTypes";

const PlaygroundPage = lazy(() => import("./playground/PlaygroundIndex"));


export const AppRouter = (): JSX.Element => {
  const [routerConfig, setRouterConfig] = useState(() => determineRoutesAndBasename(window.location.pathname));

  useEffect(() => {
    const handleLocationChange = () => {
      setRouterConfig(determineRoutesAndBasename(window.location.pathname));
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const router = createBrowserRouter(routerConfig.routes, {
    basename: routerConfig.basename,
  });

  return <RouterProvider router={router} />;
};

function determineRoutesAndBasename (pathname: string) {
  const isCheckoutRoute = pathname.startsWith(CHECKOUT_BASE_URL);
  let routes = isCheckoutRoute ? checkoutRoutes : accountRoutes;

  if (IS_DEV_ENV) {
    const playgroundRoute: PetPlaceRouteObject = {
      id: "playground",
      path: AppRoutePaths.playground,
      children: [
        { id: "playgroundIndex", element: <PlaygroundPage />, index: true },
      ],
    };
    routes = [...accountRoutes, ...checkoutRoutes, playgroundRoute];
  }

  const basename = isCheckoutRoute ? CHECKOUT_BASE_URL : ACCOUNT_BASE_URL;
  return { routes, basename };
};