import {
  ButtonProps,
  Card,
  Icon,
  IconKeys,
  LinkButton,
  Text,
  Title,
} from "../design-system";

type AlertMessageProps = {
  icon?: IconKeys;
  message: string;
  route: string;
  title: string;
};

export const PetAlertMessage = ({
  icon,
  message,
  route,
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
          <Text color="blue-500" size="14">
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
      <LinkButton {...props} variant="primary" to={route}>
        Protect my Pet
      </LinkButton>
    );
  }
};
