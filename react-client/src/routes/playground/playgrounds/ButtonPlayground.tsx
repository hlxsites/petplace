import { Button } from "~/components/design-system";
import { ButtonWithBadge } from "~/components/design-system/button/ButtonWithBadge";

export const ButtonPlayground = () => {
  return (
    <>
      <Button variant="primary">Primary button</Button>
      <Button disabled variant="primary">
        Disabled Primary button
      </Button>
      <Button variant="secondary">Secondary button</Button>
      <Button disabled variant="secondary">
        Disabled Secondary button
      </Button>
      <Button variant="error">Error button</Button>
      <Button variant="link">Link button</Button>
      <Button disabled variant="link">
        Disabled Link button
      </Button>
      <Button iconLeft="apps">Icon left</Button>
      <Button iconRight="apps">Icon right</Button>
      <ButtonWithBadge badge={3}>Button with badge</ButtonWithBadge>
    </>
  );
};
