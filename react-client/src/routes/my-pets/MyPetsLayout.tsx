import { Outlet } from "react-router-dom";
import { LayoutBasic } from "~/components/design-system";

export const MyPetsLayout = () => {
  return (
    <LayoutBasic>
      <Outlet />
    </LayoutBasic>
  );
};
