import { Title } from "~/components/design-system";
import { BasicActionCard } from "~/components/design-system/card/BasicActionCard";
import { redirectToMph } from "~/util/mphRedirectUtil";

export const AccountPaymentInformationIndex = () => {
  const actionsSections = [
    {
      buttonLabel: "Manage payment settings",
      buttonLink: redirectToMph("petplace/payment-setting"),
      message: "Verify, update, or change your payment settings.",
      title: "Payment settings",
    },
    {
      buttonLabel: "Submit a claim",
      buttonLink: "",
      message: "Direct link to your claim submissions on mypethealth.com.",
      title: "Submit a claim",
    },
  ];
  return (
    <div className="mt-xxxlarge grid gap-large">
      <Title level="h2" size="24">
        Payment information
      </Title>
      {actionsSections.map((props) => (
        <BasicActionCard key={props.buttonLabel} {...props} />
      ))}
    </div>
  );
};
