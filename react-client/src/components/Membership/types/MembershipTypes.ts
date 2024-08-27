import { ButtonProps } from "~/components/design-system";

export type MembershipPlans =
  | "Annual Protection"
  | "Lifetime"
  | "Lifetime Plus";

export type Locales = "us" | "ca";

export type TableActions = {
  label: string;
  variant: ButtonProps["variant"];
};
