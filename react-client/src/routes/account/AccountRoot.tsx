import { Outlet } from "react-router-dom";
import { useAccountIndexViewModel } from "./useAccountIndexViewModel";

export const AccountRoot = () => {
  const viewModel = useAccountIndexViewModel();

  return (
    <div className="m-auto w-full py-xxlarge xl:w-[1080px]">
      <Outlet context={viewModel} />
    </div>
  );
};
