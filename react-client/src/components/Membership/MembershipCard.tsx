import {
  Button,
  Card,
  CardProps,
  Icon,
  IconKeys,
  Text,
  Title,
} from "../design-system";

type MembershipDescriptionOffer = {
  icon?: IconKeys;
  offerLabel: string;
};

type MembershipCardProps = {
  buttonLabel: string;
  cardProps?: Omit<CardProps, "children">;
  infoFooter?: string;
  membershipDescriptionOffers?: MembershipDescriptionOffer[];
  price: string;
  priceInfo: string;
  subTitle: string;
  title: string;
};

export const MembershipCard = ({
  buttonLabel,
  cardProps,
  infoFooter,
  membershipDescriptionOffers,
  price,
  priceInfo,
  subTitle,
  title,
}: MembershipCardProps) => {
  const buttonVariant = cardProps ? "primary" : "secondary";

  return (
    <Card {...cardProps} role="region">
      <div className="grid gap-large p-large">
        <div className="gap-xsmall">
          <Title level="h4">{title}</Title>
          <Text color="text-color-supporting" size="base">
            {subTitle}
          </Text>
        </div>
        <div className="grid gap-xsmall">
          <Text fontWeight="bold" size="xxlg">
            {price}
          </Text>
          <Text color="text-color-supporting">{priceInfo}</Text>
        </div>
        <Button variant={buttonVariant}>{buttonLabel}</Button>
        <div className="grid gap-small" role="list">
          {membershipDescriptionOffers?.map(({ icon, offerLabel }, index) => (
            <div
              key={index}
              className="flex items-center gap-xsmall"
              role="listitem"
            >
              <Icon
                className={icon ? "text-red-300" : "text-green-300"}
                display={icon ?? "checkCircle"}
                size={16}
              />
              <Text size="base" textDecoration={icon ? "line-through" : "none"}>
                {offerLabel}
              </Text>
            </div>
          ))}
        </div>
        {infoFooter && <Text>{infoFooter}</Text>}
      </div>
    </Card>
  );
};