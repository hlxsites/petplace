import { useState } from "react";
import { Switch } from "~/components/design-system";

export const SwitchPlayground = () => {
  const [isChecked, setIsCHecked] = useState(false);
  return (
    <div className="grid gap-xxlarge">
      <div className="flex gap-xlarge">
        <Switch
          label="Switch orange"
          id=""
          checked={isChecked}
          onCheckedChange={() => setIsCHecked(!isChecked)}
          variant="orange"
        />
        <Switch
          label="Switch purple"
          id=""
          checked={isChecked}
          onCheckedChange={() => setIsCHecked(!isChecked)}
          variant="purple"
        />
      </div>
      <div className="flex gap-xlarge">
        {CHECKBOXES_FONT_FAMILIES.map(({ fontFamily, label }) => (
          <Switch
            label={label}
            id={label}
            // @ts-ignore for test purpose
            textProps={{ fontFamily }}
          />
        ))}
      </div>
      <div className="flex gap-xlarge">
        {CHECKBOXES_DECORATE.map(({ label, textDecoration }) => (
          <Switch
            label={label}
            id={label}
            // @ts-ignore for test purpose
            textProps={{ textDecoration }}
          />
        ))}
      </div>
      <div>
        {CHECKBOXES_SIZES.map(({ label, size }) => (
          <Switch
            key={label}
            label={label}
            id={label}
            // @ts-ignore for test purpose
            textProps={{ size }}
          />
        ))}
      </div>
    </div>
  );
};

const CHECKBOXES_SIZES = [
  {
    label: "Switch size 12",
    size: "12",
  },
  {
    label: "Switch size 14",
    size: "14",
  },
  {
    label: "Switch size 16",
    size: "16",
  },
  {
    label: "Switch size 18",
    size: "18",
  },
  {
    label: "Switch size 20",
    size: "20",
  },
  {
    label: "Switch size 24",
    size: "24",
  },
  {
    label: "Switch size 32",
    size: "32",
  },
  {
    label: "Switch size 40",
    size: "40",
  },
];

const CHECKBOXES_FONT_FAMILIES = [
  {
    label: "Switch font family franklin",
    fontFamily: "franklin",
  },
  {
    label: "Switch font family raleway",
    fontFamily: "raleway",
  },
  {
    label: "Switch font family roboto",
    fontFamily: "roboto",
  },
];

const CHECKBOXES_DECORATE = [
  {
    label: "Switch text decoration line-through",
    textDecoration: "line-through",
  },
  {
    label: "Switch text decoration underline",
    textDecoration: "underline",
  },
  {
    label: "Switch text decoration none",
    textDecoration: "none",
  },
];
