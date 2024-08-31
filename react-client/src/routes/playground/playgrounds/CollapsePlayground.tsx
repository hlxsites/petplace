import { useState } from "react";
import { Button, Collapse, Icon, Text } from "~/components/design-system";

export const CollapsePlayground = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapse
      title="Lost Pets Status Update"
      onOpenChange={() => setIsOpen(!isOpen)}
      isOpen={isOpen}
      padding="large"
    >
      <Text size="14">Track your pet's status.</Text>
      <div className="mt-base rounded-xl border p-base">
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularized in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Text>
      </div>
      <Button variant="secondary" className="mt-base" fullWidth>
        <Icon display="check" className="mr-small" /> Report as Found
      </Button>
    </Collapse>
  );
};
