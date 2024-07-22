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
      iconColor: "green-300",
    },
    {
      label: "Vaccines",
      icon: "syringe",
      iconColor: "purple-300",
    },
    {
      label: "Tests",
      icon: "pippet",
      iconColor: "blue-300",
    },
    {
      label: "Other documents",
      icon: "file",
      iconColor: "orange-300-contrast",
    },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-small lg:flex" role="list">
      {petDocumentsList.map(({ label, icon, iconColor }) => (
        <Card key={label} role="listitem">
          <div className="flex h-[116px] w-[142px] flex-col justify-between p-base">
            <Icon className={`text-${iconColor}`} display={icon} />
            <Text size="sm" fontFamily="raleway" fontWeight="bold">
              {label}
            </Text>
          </div>
        </Card>
      ))}
    </div>
  );
}
