import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { disableAemBaseMarkup, enableAemBaseMarkup } from "~/util/styleUtil";
import { AppRoutePaths } from "./AppRoutePaths";

export const Root = () => {
  const oldLocationRef = useRef("");
  const location = useLocation();

  // Hacky way to detect when we're moving in and out of the checkout page
  useEffect(() => {
    // Do nothing if we're on the first render
    if (!oldLocationRef.current) {
      // Update the old location before leaving
      oldLocationRef.current = location.pathname;
      return;
    }

    const isOldPathCheckout = oldLocationRef.current.includes(
      AppRoutePaths.checkout
    );
    const isCurrentPathCheckout = location.pathname.includes(
      AppRoutePaths.checkout
    );

    // Update the old location before processing the new one
    oldLocationRef.current = location.pathname;

    const isMovingToCheckout = isCurrentPathCheckout && !isOldPathCheckout;
    const isMovingOutOfCheckout = !isCurrentPathCheckout && isOldPathCheckout;

    if (isMovingToCheckout) {
      disableAemBaseMarkup();
    } else if (isMovingOutOfCheckout) {
      enableAemBaseMarkup();
    }
  }, [location.pathname]);

  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};
