import { Card, Title } from "~/components/design-system";

export const NotificationsTabContent = () => {
  return (
    <div className="grid gap-large">
      <Title level="h3">Communication Preferences</Title>
      <Card role="region">
        <div className="p-xxlarge">
          <Title level="h3">Offers and Resources</Title>
        </div>
      </Card>
    </div>
  );
};
