import { BasicActionCard } from "~/components/design-system/card/BasicActionCard";

export const BasicActionCardPlayground = () => {
  return (
    <BasicActionCard
      buttonLabel="Manage payment settings"
      buttonProps={{ variant: "secondary" }}
      message="Verify, update, or change your payment settings"
      title="Payment settings"
    />
  );
};
