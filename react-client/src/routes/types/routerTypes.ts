import { RouteObject } from "react-router-dom";

import { AppRoutePaths, AppRoutePathsIndexes } from "~/routes/AppRoutePaths";
import { Modify } from "~/types/misc";

export type AppRoutePathIds = keyof typeof AppRoutePaths;
type AppRouteIndexPathIds = keyof typeof AppRoutePathsIndexes;

export type RouteHandle = {
  title?: (data?: unknown) => string;
};

type CommonRoute = {
  handle?: RouteHandle;
  id: AppRoutePathIds;
};

type PetPlaceIndexRoute = Omit<CommonRoute, "id"> & {
  children?: undefined;
  id: AppRouteIndexPathIds;
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
