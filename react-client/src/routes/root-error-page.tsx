import { JSX } from "react";
import { Link, useRouteError } from "react-router-dom";

import { AppRoutePaths } from "./AppRoutePaths";

export const RootErrorPage = (): JSX.Element => {
  const error = useRouteError();

  return (
    <>
      <header>
        <h1>404 - Page not found</h1>
      </header>
      <div>
        <Link to={AppRoutePaths.root}>Go to home</Link>
        <p>Sorry, an unexpected error has occurred.</p>
        <pre>{JSON.stringify(error)}</pre>
      </div>
    </>
  );
};
