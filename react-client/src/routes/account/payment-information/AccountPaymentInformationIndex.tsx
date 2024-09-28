import { Title } from "~/components/design-system";
import { BasicActionCard } from "~/components/design-system/card/BasicActionCard";

export const AccountPaymentInformationIndex = () => {
  const actionsSections = [
    {
      buttonLabel: "Manage payment settings",
      message: "Verify, update, or change your payment settings.",
      title: "Payment settings",
    },
    {
      buttonLabel: "Submit a claim",
      message: "Direct link to your claim submissions on mypethealth.com.",
      title: "Submit a claim",
    },
  ];
  return (
    <div className="mt-xxxlarge grid gap-large">
      <Title level="h2" size="24">
        Payment information
      </Title>
      {actionsSections.map(({ buttonLabel, ...rest }) => (
        <BasicActionCard
          buttonLabel={buttonLabel}
          buttonProps={{ variant: "secondary" }}
          key={buttonLabel}
          textProps={{ size: "16" }}
          {...rest}
        />
      ))}
    </div>
  );
};
