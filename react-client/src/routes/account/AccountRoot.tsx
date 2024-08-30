import { Outlet } from "react-router-dom";

export const AccountRoot = () => {
  return (
    <div className="m-auto w-full py-xxlarge xl:w-[1080px]">
      <Outlet />
    </div>
  );
};
