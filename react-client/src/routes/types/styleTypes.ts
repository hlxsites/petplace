import { THEME_COLORS } from "tailwind.theme";

export type ThemeColors = keyof typeof THEME_COLORS;

type GetValues<Key extends ThemeColors> = keyof (typeof THEME_COLORS)[Key];

// Create union joining the color key with the keys of its value
type RawTextUnion = {
  [ColorName in ThemeColors]: `text-${ColorName}${GetValues<ColorName> extends string ? `-${GetValues<ColorName>}` : ""}`;
}[ThemeColors];

// Final union representing the classnames
// (Remove '-default' from the end of the string)
export type TextClasses = {
  [ClassString in RawTextUnion]: ClassString extends `${infer First}-${infer Second}-default`
    ? `${First}-${Second}`
    : ClassString;
}[RawTextUnion];
