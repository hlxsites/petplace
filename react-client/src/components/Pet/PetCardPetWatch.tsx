import { classNames } from "~/util/styleUtil";
import { Button, Icon, IconButton, Text } from "../design-system";
import { PetCardOption } from "./PetCardOption";

export type PetCardPetWatchProps = {
  label: string;
  labelStatus?: string;
  imgBrand?: string;
  imgLabel?: string;
  isDisabled?: boolean;
};

export const PetCardPetWatch = ({
  label,
  labelStatus,
  imgBrand,
  imgLabel,
  isDisabled,
}: PetCardPetWatchProps) => {
  return (
    <PetCardOption
      actionButton={getActionButton()}
      iconLeft={getIconLeft()}
      text={
        <div className={"flex flex-col pl-base"}>
          <Text
            color={isDisabled ? "neutral-500" : "secondary-700"}
            fontFamily="raleway"
            fontWeight="bold"
            size="base"
          >
            {label}
          </Text>
          <Text color="neutral-500">{labelStatus}</Text>
        </div>
      }
    />
  );

  function getIconLeft() {
    if (imgBrand) {
      return <img alt={imgLabel} src={imgBrand} />;
    }
    return (
      <div
        className={classNames(
          "h-xlarge w-xlarge rounded-full bg-orange-100 text-orange-500",
          {
            "bg-neutral-100 text-neutral-500": isDisabled,
          }
        )}
      >
        <Icon className={"relative left-2 top-1"} display={"phone"} size={16} />
      </div>
    );
  }

  function getActionButton() {
    if (isDisabled) {
      return (
        <Button className="p-0 text-orange-300-contrast" variant="link">
          Renew
        </Button>
      );
    }
    return (
      <IconButton
        label="chevron right"
        icon="chevronRight"
        iconProps={{
          className: "text-orange-300-contrast",
          size: 16,
        }}
        variant="link"
      />
    );
  }
};
