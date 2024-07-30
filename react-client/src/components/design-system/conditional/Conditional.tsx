import type { ReactNode } from "react";

type RenderChildren<T> =
  | ((value: Exclude<T, undefined | null>) => ReactNode)
  | ReactNode;

interface IConditionalProps {
  ifFalse?: ReactNode;
}

interface IWhenConditional extends IConditionalProps {
  children: ReactNode;
  when: boolean;
  whenTruthy?: never;
}

interface IWhenTruthyConditional<T> extends IConditionalProps {
  children: RenderChildren<T>;
  when?: never;
  whenTruthy: T;
}

export type ConditionalProps<T> = IWhenConditional | IWhenTruthyConditional<T>;

export const Conditional = <T,>(props: ConditionalProps<T>) => {
  if (propsAreWhenConditional(props)) {
    const { children, ifFalse, when } = props;

    return (
      <>
        {when && children}
        {!when && ifFalse && ifFalse}
      </>
    );
  }

  const { children, ifFalse, whenTruthy } = props;

  const when = !!whenTruthy;

  return (
    <>
      {renderChildren()}
      {!when && ifFalse && ifFalse}
    </>
  );

  function renderChildren(): ReactNode {
    if (!whenTruthy) {
      return null;
    }

    if (childrenAreRenderFunction<T>(children)) {
      return children(whenTruthy as Exclude<T, undefined | null>);
    }

    return children;
  }
};

function childrenAreRenderFunction<T>(
  children: RenderChildren<T>
): children is (value: Exclude<T, undefined | null>) => ReactNode {
  return typeof children === "function";
}

function propsAreWhenConditional<T>(
  props: IWhenConditional | IWhenTruthyConditional<T>
): props is IWhenConditional {
  return !!props.when;
}
