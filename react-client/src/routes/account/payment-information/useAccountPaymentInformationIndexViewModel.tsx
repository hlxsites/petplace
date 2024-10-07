import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import { requireAuthToken } from "~/util/authUtil";

export const loader = (() => {
  const authToken = requireAuthToken();
  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);

  return defer({
    accountDetailsQuery: accountDetailsUseCase.query(),
  });
}) satisfies LoaderFunction;

export const useAccountPaymentInformationIndexViewModel = () => {
  const loaderData = useLoaderData<typeof loader>();

  return {
    accountDetailsQuery: loaderData.accountDetailsQuery,
  };
};
