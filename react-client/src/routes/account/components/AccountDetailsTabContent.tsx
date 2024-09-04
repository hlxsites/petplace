import { Card } from "~/components/design-system";
import { AccountDetailsIndex } from "./AccountDetailsIndex";

export const AccountDetailsTabContent = () => {
  return (
    <Card role="region">
      <div className="p-xlarge">
        <AccountDetailsIndex />
      </div>
    </Card>
  );
};
