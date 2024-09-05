import { useState } from "react";
import { Checkbox } from "~/components/design-system";

export const CheckboxPlayground = () => {
  const [isChecked, setIsCHecked] = useState(false);
  return (
    <div className="grid gap-xxlarge">
      <div className="flex gap-xlarge">
        <Checkbox
          label="checkbox orange"
          id=""
          checked={isChecked}
          onCheckedChange={() => setIsCHecked(!isChecked)}
          variant="orange"
        />
        <Checkbox
          label="checkbox purple"
          id=""
          checked={isChecked}
          onCheckedChange={() => setIsCHecked(!isChecked)}
          variant="purple"
        />
      </div>
      <div className="flex gap-xlarge">
        {CHECKBOXES_FONT_FAMILIES.map(({ fontFamily, label }) => (
          <Checkbox
            label={label}
            id={label}
            // @ts-expect-error  for test purpose
            textProps={{ fontFamily }}
          />
        ))}
      </div>
      <div className="flex gap-xlarge">
        {CHECKBOXES_DECORATE.map(({ label, textDecoration }) => (
          <Checkbox
            label={label}
            id={label}
            // @ts-expect-error  for test purpose
            textProps={{ textDecoration }}
          />
        ))}
      </div>
      <div>
        {CHECKBOXES_SIZES.map(({ label, size }) => (
          <Checkbox
            key={label}
            label={label}
            id={label}
            // @ts-expect-error  for test purpose
            textProps={{ size }}
          />
        ))}
      </div>
    </div>
  );
};

const CHECKBOXES_SIZES = [
  {
    label: "Checkbox size 12",
    size: "12",
  },
  {
    label: "Checkbox size 14",
    size: "14",
  },
  {
    label: "Checkbox size 16",
    size: "16",
  },
  {
    label: "Checkbox size 18",
    size: "18",
  },
  {
    label: "Checkbox size 20",
    size: "20",
  },
  {
    label: "Checkbox size 24",
    size: "24",
  },
  {
    label: "Checkbox size 32",
    size: "32",
  },
  {
    label: "Checkbox size 40",
    size: "40",
  },
];

const CHECKBOXES_FONT_FAMILIES = [
  {
    label: "checkbox font family franklin",
    fontFamily: "franklin",
  },
  {
    label: "checkbox font family raleway",
    fontFamily: "raleway",
  },
  {
    label: "checkbox font family roboto",
    fontFamily: "roboto",
  },
];

const CHECKBOXES_DECORATE = [
  {
    label: "checkbox text decoration line-through",
    textDecoration: "line-through",
  },
  {
    label: "checkbox text decoration underline",
    textDecoration: "underline",
  },
  {
    label: "checkbox text decoration none",
    textDecoration: "none",
  },
];
