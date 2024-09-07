import { Button, Card, Text, Title } from "../design-system";

type ChangePasswordProps = {
  onChangePassword?: () => void;
};

export const ChangePassword = ({ onChangePassword }: ChangePasswordProps) => {
  return (
    <Card data-testid="ChangePasswordCard">
      <div className="grid grid-cols-1 items-center justify-between gap-xlarge p-xlarge lg:flex">
        <div className="grid gap-small">
          <Title level="h3">Change password</Title>
          <Text size="16">Create new account password</Text>
        </div>

        <Button onClick={onChangePassword}>Change password</Button>
      </div>
    </Card>
  );
};
