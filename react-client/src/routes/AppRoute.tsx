import { useEffect } from "react";
import {
  createBrowserRouter,
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
        search: searchParams.get("search") ?? ''
    });
    }
  }, []);

  return (
    <div>
      Hello world!
      <Outlet />
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
        path: "account",
        element: <p>Account</p>,
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
