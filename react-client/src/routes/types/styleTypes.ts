import { THEME_COLORS } from "tailwind.theme";

export type ThemeColors = keyof typeof THEME_COLORS;

/**
 * Retrieves the keys of the specified theme color from the THEME_COLORS object.
 *
 * @template Key - The theme color to retrieve the keys from.
 * @returns {keyof (typeof THEME_COLORS)[Key]} - The keys of the specified theme color.
 */
type GetValues<Key extends ThemeColors> = keyof (typeof THEME_COLORS)[Key];

/**
 * Represents a union type that combines a prefix with theme colors.
 *
 * @template Prefix - The prefix type.
 * @returns A string union type that combines the prefix with theme colors.
 */
type RawColorUnion<Prefix extends string> = {
  [ColorName in ThemeColors]: `${Prefix}-${ColorName}${GetValues<ColorName> extends string ? `-${GetValues<ColorName>}` : ""}`;
}[ThemeColors];

/**
 * Type utility to create a final union representing color classnames
 * (it removes '-default' from the end of the string)
 *
 * @template ColorUnion - The string type to cleanup.
 * @returns The cleaned up color classes.
 */
type CleanupColorClasses<ColorUnion extends string> = {
  [ClassString in ColorUnion]: ClassString extends `${infer First}-${infer Second}-default`
    ? `${First}-${Second}`
    : ClassString;
}[ColorUnion];

export type BackgroundColorClasses = CleanupColorClasses<RawColorUnion<"bg">>;

export type BorderColorClasses = CleanupColorClasses<RawColorUnion<"border">>;

export type FromColorClasses = CleanupColorClasses<RawColorUnion<"from">>;

export type TextColorClasses = CleanupColorClasses<RawColorUnion<"text">>;
