import { useState } from "react";
import { Checkbox, Switch } from "~/components/design-system";

export const CheckboxSwitchPlayground = () => {
  const [isChecked, setIsCHecked] = useState(false);
  return (
    <>
      <Switch
        label=""
        id=""
        checked={isChecked}
        onCheckedChange={() => setIsCHecked(!isChecked)}
      />
      <Switch
        label=""
        id=""
        checked={isChecked}
        onCheckedChange={() => setIsCHecked(!isChecked)}
        variant="purple"
      />
      <Checkbox
        label=""
        id=""
        checked={isChecked}
        onCheckedChange={() => setIsCHecked(!isChecked)}
        variant="orange"
      />
      <Checkbox
        label=""
        id=""
        checked={isChecked}
        onCheckedChange={() => setIsCHecked(!isChecked)}
        variant="purple"
      />
    </>
  );
};
