import { useSearchParams } from "react-router-dom";
import { CONTENT_PARAM_KEY } from "~/util/searchParamsKeys";

type FnOptions = {
  persistOtherParams?: boolean;
};

export const useDrawerContentState = (drawerKey: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDrawerOpen = searchParams.get(CONTENT_PARAM_KEY) === drawerKey;

  const onOpenDrawer = ({ persistOtherParams }: FnOptions = {}) => {
    setSearchParams((next) => {
      if (persistOtherParams) {
        next.set(CONTENT_PARAM_KEY, drawerKey);
        return next;
      }

      return new URLSearchParams({ [CONTENT_PARAM_KEY]: drawerKey });
    });
  };

  const onCloseDrawer = ({ persistOtherParams }: FnOptions = {}) => {
    setSearchParams((next) => {
      if (persistOtherParams) {
        next.delete(CONTENT_PARAM_KEY);
        return next;
      }
      return new URLSearchParams();
    });
  };

  return {
    isDrawerOpen,
    onCloseDrawer,
    onOpenDrawer,
  };
};
