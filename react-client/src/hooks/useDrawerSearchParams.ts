import { useSearchParams } from "react-router-dom";

export const useDrawerSearchParams = (drawerKey: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDrawerOpen = searchParams.get("content") === drawerKey;

  const onOpenDrawer = () => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      content: drawerKey,
    });
  };

  const onCloseDrawer = () => {
    setSearchParams((next) => {
      next.delete("content");
      return next;
    });
  };

  return {
    isDrawerOpen,
    onOpenDrawer,
    onCloseDrawer,
  };
};
