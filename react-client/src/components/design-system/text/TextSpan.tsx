import { ComponentProps } from "react";
import { Text } from "./Text";

export const TextSpan = (
  props: Omit<ComponentProps<typeof Text>, "element">
) => {
  return <Text element="span" inherit {...props} />;
};
