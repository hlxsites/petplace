import { RouteObject } from "react-router-dom";

import { AppRoutePathIds, AppRoutePaths } from "~/routes/AppRoutePaths";
import { Modify } from "./misc";

type RouteHandle = {
  ignorePageLayout?: boolean;
  title?: (data?: unknown) => string;
};

type CommonRoute = {
  handle?: RouteHandle;
  id: AppRoutePathIds;
};

type PetPlaceIndexRoute = CommonRoute & {
  children?: undefined;
  index: true;
  path?: undefined;
};

type PetPlaceNonIndexRoute = CommonRoute & {
  children?: PetPlaceRouteObject[];
  index?: false;
  path: (typeof AppRoutePaths)[keyof typeof AppRoutePaths];
};

export type PetPlaceRouteObject = Modify<
  RouteObject,
  PetPlaceIndexRoute | PetPlaceNonIndexRoute
>;
