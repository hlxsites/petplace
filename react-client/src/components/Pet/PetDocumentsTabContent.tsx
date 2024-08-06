import { Link } from "react-router-dom";
import { usePetProfileContext } from "~/routes/my-pets/:petId/usePetProfileLayoutViewModel";
import { Card, Icon } from "../design-system";
import { Text } from "../design-system/text/Text";

export function PetDocumentsTabContent() {
  const { documentTypes } = usePetProfileContext();
  return (
    <div
      className="grid w-full grid-cols-2 gap-small lg:grid-cols-4"
      role="list"
    >
      {documentTypes.map(({ id, label, icon, iconColor }) => (
        <Card key={label} role="listitem">
          <Link
            className="flex h-[116px] cursor-pointer flex-col justify-between p-base"
            to={id}
          >
            <Icon className={iconColor} display={icon} />
            <Text size="sm" fontFamily="raleway" fontWeight="bold">
              {label}
            </Text>
          </Link>
        </Card>
      ))}
    </div>
  );
}
