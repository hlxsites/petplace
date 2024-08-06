import React, { useCallback, useMemo } from "react";
import { Card, Drawer, Icon } from "../design-system";
import { Text } from "../design-system/text/Text";
import { usePetProfileContext } from "~/routes/my-pets/:petId/usePetProfileLayoutViewModel";
import { PetDocumentsView } from "./PetDocumentsView";
import { PetRecord } from "./types/PetRecordsTypes";
import { convertToCamelCase } from "~/util/stringFunctions";
import { IconKeys } from "../design-system/icon/Icon";

type PetDocument = {
  label: string;
  icon: IconKeys;
  iconColor: string;
};

type PetRecords = {
  [key: string]: PetRecord[] | undefined;
};

const PET_DOCUMENTS_LIST: PetDocument[] = [
  { label: "Medical Records", icon: "medicine", iconColor: "text-green-300" },
  { label: "Vaccines", icon: "syringe", iconColor: "text-purple-300" },
  { label: "Tests", icon: "pippet", iconColor: "text-blue-300" },
  {
    label: "Other documents",
    icon: "file",
    iconColor: "text-orange-300-contrast",
  },
];

const useDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("");

  const open = useCallback((label: string) => {
    setSelectedOption(label);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedOption("");
  }, []);

  return { isOpen, selectedOption, open, close };
};

const useRecords = (records: PetRecords | undefined) => {
  const recordOptions = useMemo(() => {
    if (!records) return {};
    return Object.keys(records).reduce(
      (acc, key) => {
        acc[key] = records[key] || [];
        return acc;
      },
      {} as { [key: string]: PetRecord[] }
    );
  }, [records]);

  const getSelectedRecords = useCallback(
    (label: string) => {
      const formattedOption = convertToCamelCase(label);
      return recordOptions[formattedOption] || [];
    },
    [recordOptions]
  );

  return { getSelectedRecords };
};

export function PetDocumentsTabContent() {
  const { petInfo } = usePetProfileContext();
  const { records } = petInfo;
  const drawer = useDrawer();
  const { getSelectedRecords } = useRecords(records);

  const onDeleteRecord = useCallback((recordId: string, recordType: string) => {
    // Implement delete functionality when has API
    console.log(`Deleting record ${recordId} of type ${recordType}`);
  }, []);

  const selectedRecords = useMemo(
    () => getSelectedRecords(drawer.selectedOption),
    [getSelectedRecords, drawer.selectedOption]
  );

  return (
    <>
      <div
        className="grid w-full grid-cols-2 gap-small lg:grid-cols-4"
        role="list"
      >
        {PET_DOCUMENTS_LIST.map(({ label, icon, iconColor }) => (
          <Card key={label} role="listitem">
            <div
              className="flex h-[116px] cursor-pointer flex-col justify-between p-base"
              onClick={() => drawer.open(label)}
            >
              <Icon className={iconColor} display={icon} />
              <Text size="sm" fontFamily="raleway" fontWeight="bold">
                {label}
              </Text>
            </div>
          </Card>
        ))}
      </div>
      <Drawer
        id={drawer.selectedOption}
        isOpen={drawer.isOpen}
        onClose={drawer.close}
        title={drawer.selectedOption}
      >
        <PetDocumentsView
          documents={selectedRecords}
          onDelete={onDeleteRecord}
          recordType={drawer.selectedOption.toLowerCase()}
        />
      </Drawer>
    </>
  );
}
