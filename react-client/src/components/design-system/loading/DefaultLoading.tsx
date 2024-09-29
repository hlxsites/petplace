import { CSSProperties } from "react";
import { Loading } from "./Loading";

type DefaultLoadingProps = {
  minHeight?: CSSProperties["minHeight"];
  minWidth?: CSSProperties["minWidth"];
};

export const DefaultLoading = (props: DefaultLoadingProps) => {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={props}
    >
      <Loading />
    </div>
  );
};
