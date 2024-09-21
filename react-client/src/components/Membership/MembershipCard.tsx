import { MembershipInfo } from "~/domain/checkout/CheckoutModels";
import { classNames } from "~/util/styleUtil";
import { Button, Card, Icon, Text, Title } from "../design-system";

type MembershipCardProps = Omit<MembershipInfo, "comparePlansButtonLabel">;

export const MembershipCard = ({
  buttonLabel,
  infoFooter,
  isHighlighted,
  membershipDescriptionOffers,
  price,
  priceInfo,
  subTitle,
  title,
}: MembershipCardProps) => {
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
        <Button variant={buttonVariant}>{buttonLabel}</Button>
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
