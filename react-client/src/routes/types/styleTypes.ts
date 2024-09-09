import { SPACING_DEFAULTS, THEME_COLORS } from "tailwind.theme";

export type ThemeColors = keyof typeof THEME_COLORS;
type SpacingKeys = keyof typeof SPACING_DEFAULTS;

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
 * Type utility to create a final union representing classnames
 * (it removes '-default' from the end of the string)
 *
 * @template TypeUnion - The string type to cleanup.
 * @returns The cleaned up classes.
 */
type CleanupClasses<TypeUnion extends string> = {
  [ClassString in TypeUnion]: ClassString extends `${infer First}-${infer Second}-default`
    ? `${First}-${Second}`
    : ClassString;
}[TypeUnion];

export type BackgroundColorClasses = CleanupClasses<RawColorUnion<"bg">>;

export type BorderColorClasses = CleanupClasses<RawColorUnion<"border">>;

export type FromColorClasses = CleanupClasses<RawColorUnion<"from">>;

export type TextColorClasses = CleanupClasses<RawColorUnion<"text">>;

export type PaddingClasses = CleanupClasses<`p-${SpacingKeys}`>;

export type DisplayClasses =
  | "hidden"
  | "static"
  | "inline"
  | "inline-block"
  | "block"
  | "flex"
  | "grid";
