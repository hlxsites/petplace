import { UIMatch, useMatches } from "react-router-dom";
import { RouteHandle } from "~/routes/types/routerTypes";

export const useRouteTitle = (): RouteHandle["title"] => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];

  // We want to find the last matched route with a handle
  const match = matches.reverse().find(({ handle }) => !!handle?.title);
  return match?.handle?.title;
};
