import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Title } from "~/components/design-system";
import { BasicActionCard } from "~/components/design-system/card/BasicActionCard";
import { ExternalAccountDetailsModel } from "~/domain/models/user/UserModels";
import { redirectToMph } from "~/util/mphRedirectUtil";
import { useAccountPaymentInformationIndexViewModel } from "./useAccountPaymentInformationIndexViewModel";

export const AccountPaymentInformationIndex = () => {
  const { accountDetailsQuery } = useAccountPaymentInformationIndexViewModel();

  return (
    <div className="mt-xxxlarge grid gap-large">
      <Title level="h2" size="24">
        Payment information
      </Title>
      {
        <SuspenseAwait resolve={accountDetailsQuery}>
          {(accountDetailsQuery) => {
            return actionsSections(
              (accountDetailsQuery as ExternalAccountDetailsModel).insuranceUrl
            ).map((props) => (
              <BasicActionCard key={props.buttonLabel} {...props} />
            ));
          }}
        </SuspenseAwait>
      }
    </div>
  );

  function actionsSections(insuranceUrl?: string) {
    const actions = [
      {
        buttonLabel: "Manage payment settings",
        buttonLink:redirectToMph("petplace/payment-setting"),
        message: "Verify, update, or change your payment settings.",
        title: "Payment settings",
      },
    ];

    if (insuranceUrl) {
      actions.push({
        buttonLabel: "Submit a claim",
        buttonLink: insuranceUrl,
        message: "Direct link to your claim submissions on mypethealth.com.",
        title: "Submit a claim",
      });
    }

    return actions;
  }
};
