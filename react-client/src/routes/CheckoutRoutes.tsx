import isEqual from "lodash/isEqual";
import { AppRoutePaths } from "./AppRoutePaths";
import { Root } from "./root";
import { RootErrorPage } from "./root-error-page";
import { PetPlaceRouteObject } from "./types/routerTypes";

import { IS_DEV_ENV } from "~/util/envUtil";
import { CheckoutIndex } from "./checkout/CheckoutIndex";
import { ProductsIndex } from "./checkout/products/ProductsIndex";
import { loader as CheckoutIndexLoader } from "./checkout/useCheckoutIndexViewModel";

export const checkoutRoutes: PetPlaceRouteObject[] = [
  {
    id: IS_DEV_ENV ? "checkout" : "root",
    path: IS_DEV_ENV ? AppRoutePaths.checkout : AppRoutePaths.root,
    element: <Root />,
    errorElement: <RootErrorPage />,
    children: [
      {
        id: "checkoutIndex",
        index: true,
        loader: CheckoutIndexLoader,
        shouldRevalidate: ({ currentParams, nextParams }) =>
          !isEqual(currentParams, nextParams),
        element: <CheckoutIndex />,
      },
      {
        id: "products",
        element: <ProductsIndex />,
        // fix the loader when discover if products will be available via API or hardcoded
        loader: CheckoutIndexLoader,
        shouldRevalidate: ({ currentParams, nextParams }) =>
          !isEqual(currentParams, nextParams),
        path: AppRoutePaths.products,
      },
    ],
  },
];
