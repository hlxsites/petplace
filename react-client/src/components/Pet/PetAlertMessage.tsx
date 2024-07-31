import { Button, ButtonProps } from "../design-system";
import { Icon } from "../design-system/icon/Icon";
import { Title } from "../design-system/text/Title";
import { Text } from "../design-system/text/Text";
import { CardWrapper } from "../design-system/card/CardWrapper";

type AlertMessageProps = {
  onClick?: () => void;
  petName: string;
};

export const PetAlertMessage = ({ onClick, petName }: AlertMessageProps) => {
  return (
    <CardWrapper
      backgroundColor="bg-blue-100"
      border="border-blue-100"
      shadow="elevation-3"
    >
      <div className="grid gap-small p-base">
        <div className="flex justify-between">
          <div className="flex gap-[10px]">
            <Icon className="text-blue-500" display="stethoscope" />
            <Title color="blue-500" level="h4">
              Secure Your Pet's Future
            </Title>
          </div>
          {renderGetQuoteButton({ className: "hidden h-[30px] lg:flex" })}
        </div>
        <div className="pl-xxlarge">
          <Text
            color="blue-500"
            size="base"
          >{`Get a personalized insurance quote and ensure the best care for ${petName}`}</Text>
        </div>
        {renderGetQuoteButton({
          className: "h-[30px] w-full lg:hidden",
        })}
      </div>
    </CardWrapper>
  );

  function renderGetQuoteButton(props: Pick<ButtonProps, "className">) {
    return (
      <Button {...props} onClick={onClick}>
        Get Quote Now
      </Button>
    );
  }
};
