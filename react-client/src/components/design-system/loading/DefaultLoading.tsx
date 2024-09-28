import { CSSProperties } from "react";
import { Loading } from "./Loading";

type DefaultLoadingProps = {
  minHeight?: CSSProperties["minHeight"];
};

export const DefaultLoading = ({ minHeight }: DefaultLoadingProps) => {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ minHeight }}
    >
      <Loading />
    </div>
  );
};
