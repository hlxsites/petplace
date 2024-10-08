import { useMatches } from "react-router-dom";

export const useRouteHandle = (
  paramKey: string
) => {
  const matches = useMatches();

  // We want to find the last match with a handle
  const match = matches.reverse().find((m) => !!m.handle);

  // @ts-expect-error - Find a way to type it
  return match.handle?.[paramKey] || null
};
