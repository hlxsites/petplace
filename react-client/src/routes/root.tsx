import { useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

export const Root = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <div className="py-xxlarge m-auto w-full xl:w-[1080px]">
        <Outlet />
      </div>
    </div>
  );
};
