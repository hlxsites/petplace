import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "~/util/misc";

export const useIsomorphicLayoutEffect = isBrowser
  ? useLayoutEffect
  : useEffect;
