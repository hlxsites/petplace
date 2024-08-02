import { ComponentProps } from "react";
import { Title } from "./Title";

export const TitleSpan = (
  props: Omit<ComponentProps<typeof Title>, "element" | "level">
) => {
  return <Title level="inherit" {...props} element="span" />;
};
