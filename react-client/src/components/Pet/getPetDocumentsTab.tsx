import { Card, Icon, IconKeys } from "../design-system";
import { Text } from "../design-system/text/Text";

type PetDocument = {
  label: string;
  icon: IconKeys;
  iconColor: string;
};

export function getPetDocumentsTab() {
  const petDocumentsList: PetDocument[] = [
    {
      label: "Medical Records",
      icon: "medicine",
      iconColor: "text-green-300",
    },
    {
      label: "Vaccines",
      icon: "syringe",
      iconColor: "text-purple-300",
    },
    {
      label: "Tests",
      icon: "pippet",
      iconColor: "text-blue-300",
    },
    {
      label: "Other documents",
      icon: "file",
      iconColor: "text-orange-300-contrast",
    },
  ];

  return (
    <div
      className="grid w-full grid-cols-2 gap-small lg:grid-cols-4"
      role="list"
    >
      {petDocumentsList.map(({ label, icon, iconColor }) => (
        <Card key={label} role="listitem">
          <div className="flex h-[116px] flex-col justify-between p-base">
            <Icon className={iconColor} display={icon} />
            <Text size="sm" fontFamily="raleway" fontWeight="bold">
              {label}
            </Text>
          </div>
        </Card>
      ))}
    </div>
  );
}
