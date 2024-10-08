import {
  Button,
  ButtonProps,
  Card,
  Icon,
  IconKeys,
  Text,
  Title,
} from "../design-system";

type AlertMessageProps = {
  icon?: IconKeys;
  message: string;
  onClick?: () => void;
  title: string;
};

export const PetAlertMessage = ({
  icon,
  message,
  onClick,
  title,
}: AlertMessageProps) => {
  return (
    <Card
      backgroundColor="bg-blue-100"
      border="border-blue-100"
      shadow="elevation-3"
    >
      <div className="grid gap-small p-base">
        <div className="flex justify-between">
          <div className="flex gap-[10px]">
            <Icon className="text-blue-500" display={icon ?? "stethoscope"} />
            <Title color="blue-500" level="h4">
              {title}
            </Title>
          </div>
          {renderGetQuoteButton({ className: "hidden h-[30px] lg:flex" })}
        </div>
        <div className="pl-xxlarge">
          <Text color="blue-500" size="base">
            {message}
          </Text>
        </div>
        {renderGetQuoteButton({
          className: "h-[30px] w-full lg:hidden",
        })}
      </div>
    </Card>
  );

  function renderGetQuoteButton(props: Pick<ButtonProps, "className">) {
    return (
      <Button {...props} onClick={onClick}>
        Get Quote Now
      </Button>
    );
  }
};
