import { ButtonProps } from "~/components/design-system";

export type MembershipPlan =
  | "Annual Protection"
  | "Lifetime"
  | "Lifetime Plus";

export type Locale = "us" | "ca";

export type TableActions = {
  label: string;
  variant?: ButtonProps["variant"];
};
