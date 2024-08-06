import { classNames } from "~/util/styleUtil";
import { Button, Icon, IconButton, Text } from "../design-system";
import { PetCardOption } from "./PetCardOption";

const PET_CARD_PET_WATCH_OPTIONS = [
  {
    text: "24/7 Lost Pet Support",
  },
  {
    text: "Lost Pet Recovery Specialists",
  },
  {
    text: "DirectConnect",
  },
  {
    text: "$30 Rover Discount",
  },
  {
    text: "$25 Petco Coupon",
  },
  {
    text: "24PetMedAlert",
  },
  {
    text: "24/7 Vet Helpline",
  },
  {
    isDisabled: true,
    status: "Expired",
    text: "Customized Pet Training",
  },
  {
    text: "Lifetime Warranty ID Tag",
  },
];

export const PetCardPetWatch = () => {
  return PET_CARD_PET_WATCH_OPTIONS.map(({ isDisabled, status, text }) => {
    return (
      <PetCardOption
        actionButton={
          isDisabled ? (
            <Button className="text-orange-300-contrast" variant="link">
              Renew
            </Button>
          ) : (
            <IconButton
              iconProps={{ className: "text-brand-secondary" }}
              icon="chevronRight"
              label="arrow to right"
              variant="link"
            />
          )
        }
        iconLeft={
          <div
            className={classNames(
              "relative mr-base h-8 w-8 rounded-full bg-orange-100",
              {
                "bg-neutral-100": isDisabled,
              }
            )}
          >
            <Icon
              className={classNames("absolute left-2 top-2 text-orange-500", {
                "text-neutral-400": isDisabled,
              })}
              display="phone"
              size={16}
            />
          </div>
        }
        key={text}
        text={
          <div className="grid gap-xsmall">
            <Text
              color={isDisabled ? "text-neutral-500" : "text-black"}
              fontFamily="raleway"
              fontWeight="bold"
              size="base"
            >
              {text}
            </Text>
            <Text>{status}</Text>
          </div>
        }
      />
    );
  });
};
