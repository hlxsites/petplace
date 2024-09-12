import { ComponentProps, CSSProperties, Suspense } from "react";
import { Await } from "react-router-typesafe";
import { Loading } from "../design-system";

type SuspenseAwaitProps<T> = ComponentProps<typeof Await<T>> & {
  minHeight?: CSSProperties["minHeight"];
};

export const SuspenseAwait = <T,>({
  children,
  minHeight,
  ...rest
}: SuspenseAwaitProps<T>) => {
  const fallback = (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ minHeight }}
    >
      <Loading />
    </div>
  );
  return (
    <Suspense fallback={fallback}>
      <Await {...rest}>{children}</Await>
    </Suspense>
  );
};
