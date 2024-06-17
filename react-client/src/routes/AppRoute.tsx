import { useEffect } from "react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectFrom = searchParams.get("redirectFrom");
    if (redirectFrom) {
      navigate({
        pathname: redirectFrom,
        search: searchParams.get("search") ?? "",
      });
    }
  }, []);

  return (
    <div style={{ padding: 16 }}>
      This is the Root route.
      <div style={{ padding: `20px 0` }}>
        <hr />
        <Outlet />
      </div>
    </div>
  );
};

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <p>Not found</p>,
    children: [
      {
        index: true,
        element: <Link to="account">Go to account</Link>,
      },
      {
        path: "account",
        element: (
          <>
            <p>This is the Account route</p>
            <br />
            <Link to="..">Back</Link>
          </>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: "/react-test",
});

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />;
};
