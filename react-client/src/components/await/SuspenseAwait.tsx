import { ComponentProps, Suspense } from "react";
import { Await } from "react-router-typesafe";
import { DefaultLoading } from "../design-system/loading/DefaultLoading";

type SuspenseAwaitProps<T> = ComponentProps<typeof Await<T>> &
  ComponentProps<typeof DefaultLoading>;
export const SuspenseAwait = <T,>({
  children,
  minHeight,
  ...rest
}: SuspenseAwaitProps<T>) => {
  return (
    <Suspense fallback={<DefaultLoading minHeight={minHeight} />}>
      <Await {...rest}>{children}</Await>
    </Suspense>
  );
};
