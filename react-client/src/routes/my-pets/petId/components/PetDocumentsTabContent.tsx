import { Link } from "react-router-dom";
import { Card, Icon, Text } from "~/components/design-system";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";

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
            className="flex h-[116px] cursor-pointer flex-col justify-between p-base no-underline"
            to={id}
          >
            <Icon className={iconColor} display={icon} />
            <Text size="14" fontFamily="raleway" fontWeight="bold">
              {label}
            </Text>
          </Link>
        </Card>
      ))}
    </div>
  );
}
