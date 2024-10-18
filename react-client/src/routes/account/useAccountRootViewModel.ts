import { LoaderFunction, useLoaderData } from "react-router-typesafe";
import { checkIsSsoEnabledLogin } from "~/util/authUtil";

export const loader = (() => {
  const isExternalLogin = checkIsSsoEnabledLogin();

  return { isExternalLogin };
}) satisfies LoaderFunction;

export type AccountRootLoaderData = ReturnType<typeof loader>;

export const useAccountRootViewModel = () => {
  const loaderData = useLoaderData<typeof loader>();

  return loaderData;
};
