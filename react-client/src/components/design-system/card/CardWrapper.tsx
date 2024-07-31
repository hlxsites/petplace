import { CardProps } from "../types/CardTypes";
import { Card } from "./Card";

export const CardWrapper = ({ ...props }: CardProps) => {
  return <Card {...props}>{props.children}</Card>;
};
