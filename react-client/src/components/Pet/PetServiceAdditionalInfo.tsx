import { ReactNode } from "react";
import { Text } from "../design-system";

export const PetServiceAdditionalInfo = ({ info }: { info: ReactNode }) => {
  const isLabelString = typeof info === "string";

  return (
    <div className="flex flex-col gap-base p-large">
      {isLabelString ? <Text size="14">{info}</Text> : info}
    </div>
  );
};
