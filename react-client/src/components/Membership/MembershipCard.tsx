import { MembershipInfo } from "~/domain/checkout/CheckoutModels";
import { classNames } from "~/util/styleUtil";
import { Card, Icon, LinkButton, Text, Title } from "../design-system";
import { useMembershipProductsLink } from "./hooks/useMembershipProductsLink";

type MembershipCardProps = Omit<
  MembershipInfo,
  "comparePlansButtonLabel" | "hardCodedPlanId"
>;

export const MembershipCard = ({
  buttonLabel,
  id,
  infoFooter,
  isHighlighted,
  membershipDescriptionOffers,
  price,
  priceInfo,
  subTitle,
  title,
}: MembershipCardProps) => {
  const buttonLink = useMembershipProductsLink(id);

  const buttonVariant = isHighlighted ? "primary" : "secondary";

  return (
    <Card
      backgroundColor={isHighlighted ? "bg-purple-100" : undefined}
      role="region"
    >
      <div className="grid gap-large p-large">
        <div className="grid gap-xsmall">
          <Title level="h4">{title}</Title>
          <Text color="text-color-supporting" size="14">
            {subTitle}
          </Text>
        </div>
        <div className="grid gap-xsmall">
          <Text fontWeight="bold" size="40">
            {price}
          </Text>
          <Text color="text-color-supporting">{priceInfo}</Text>
        </div>
        <LinkButton variant={buttonVariant} to={buttonLink} fullWidth>
          {buttonLabel}
        </LinkButton>
        <div
          className={classNames("grid gap-small", {
            "pb-xxlarge": !infoFooter,
          })}
          role="list"
        >
          {membershipDescriptionOffers?.map(
            ({ offerLabel, isNotAvailableOnPlan }, index) => (
              <div
                key={index}
                className="flex items-center gap-xsmall"
                role="listitem"
              >
                <Icon
                  className={
                    isNotAvailableOnPlan ? "text-red-300" : "text-green-300"
                  }
                  display={isNotAvailableOnPlan ? "clearCircle" : "checkCircle"}
                  size={16}
                />
                <Text
                  size="14"
                  textDecoration={
                    isNotAvailableOnPlan ? "line-through" : "none"
                  }
                >
                  {offerLabel}
                </Text>
              </div>
            )
          )}
        </div>
        {infoFooter && <Text>{infoFooter}</Text>}
      </div>
    </Card>
  );
};
