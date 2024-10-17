import { Dispatch, SetStateAction } from "react";
import { MembershipInfo } from "~/domain/checkout/CheckoutModels";
import { MEMBERSHIP_COMPARE_PLANS } from "~/domain/useCases/checkout/utils/checkoutHardCodedData";
import { Collapse, LinkButton, Text } from "../design-system";
import { PlanBenefitCard } from "./PlanBenefitCard";
import { useMembershipProductsLink } from "./hooks/useMembershipProductsLink";

type PlanBenefitListProps = Pick<
  MembershipInfo,
  "hardCodedPlanId" | "title" | "comparePlansButtonLabel" | "id"
> & {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const PlanBenefitsList = ({
  comparePlansButtonLabel,
  hardCodedPlanId,
  id,
  isOpen,
  title,
  setIsOpen,
}: PlanBenefitListProps) => {
  const buttonLink = useMembershipProductsLink(id);

  return (
    <div className="mt-medium md:hidden">
      <Collapse
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={
          <Text size="18" fontFamily="raleway" fontWeight="bold">
            {title} benefits
          </Text>
        }
        padding="medium"
        triggerNoMargin
      >
        <div className="grid gap-medium pt-medium">
          {MEMBERSHIP_COMPARE_PLANS.map(
            ({ availableColumns, ...benefitProps }) => (
              <PlanBenefitCard
                {...benefitProps}
                key={benefitProps.title}
                isAvailable={availableColumns.includes(hardCodedPlanId)}
              />
            )
          )}

          <LinkButton to={buttonLink} variant="primary" fullWidth>
            {comparePlansButtonLabel}
          </LinkButton>
        </div>
      </Collapse>
    </div>
  );
};
