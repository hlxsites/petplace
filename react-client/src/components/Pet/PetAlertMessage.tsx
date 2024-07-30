import { Button } from "../design-system";
import { Card } from "../design-system/card/Card";
import { Icon } from "../design-system/icon/Icon";
import { Title } from "../design-system/text/Title";
import { Text } from "../design-system/text/Text";

type AlertMessageProps = {
  onClick?: () => void;
  petName: string;
};

export const PetAlertMessage = ({ onClick, petName }: AlertMessageProps) => {
  return (
    <Card backgroundColor="blue-100" border="blue-100" shadow="elevation-3">
      <div className="grid gap-small p-base">
        <div className="flex justify-between">
          <div className="flex gap-[10px]">
            <Icon className="text-blue-500" display="stethoscope" />
            <Title color="blue-500" level="h4">
              Secure Your Pet's Future
            </Title>
          </div>

          <Button className="hidden h-[30px] lg:flex" onClick={onClick}>
            Get Quote Now
          </Button>
        </div>
        <div className="pl-xxlarge">
          {/* TODO: fix the size, should be 14px 
          TODO: insert new color,
          should be blue-500 */}
          <Text size="base">{`Get a personalized insurance quote and ensure the best care for ${petName}`}</Text>
        </div>
        {renderGetQuoteButton()}
      </div>
    </Card>
  );

  function renderGetQuoteButton() {
    return (
      <Button className="h-[30px] w-full lg:hidden" onClick={onClick}>
        Get Quote Now
      </Button>
    );
  }
};
