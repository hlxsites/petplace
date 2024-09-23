import { classNames } from "~/util/styleUtil";
import { Icon, IconButton, IconKeys, Text } from "../design-system";
import { PetCardOption } from "./PetCardOption";

export type PetCardPetWatchProps = {
  icon?: IconKeys;
  id?: string;
  imgBrand?: string;
  imgLabel?: string;
  isDisabled?: boolean;
  label: string;
  labelStatus?: string;
  onClick?: () => void;
};

export const PetCardPetWatch = ({
  icon,
  imgBrand,
  imgLabel,
  isDisabled,
  label,
  labelStatus,
  onClick,
}: PetCardPetWatchProps) => {
  return (
    <PetCardOption
      actionButton={getActionButton()}
      iconLeft={getIconLeft()}
      isDisabled={isDisabled}
      text={
        <div className={"flex flex-col pl-base"}>
          <Text
            color={isDisabled ? "neutral-500" : "secondary-700"}
            fontFamily="raleway"
            fontWeight="bold"
            size="14"
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
        <Icon
          className={"relative left-2 top-1"}
          display={icon ?? "phone"}
          size={16}
        />
      </div>
    );
  }

  function getActionButton() {
    return (
      <IconButton
        disabled={isDisabled}
        label="chevron right"
        icon="chevronRight"
        iconProps={{
          className: isDisabled
            ? "text-neutral-500"
            : "text-orange-300-contrast",
          size: 16,
        }}
        variant="link"
        onClick={onClick}
      />
    );
  }
};
