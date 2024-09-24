export type Colors = "black" | "white";
export type Sizes = "L" | "S/M" | "One Size" | "S";

export type ProductDescription = {
  availableColors?: Colors[] | null;
  availableSizes?: Sizes[] | null;
  description?: string | null;
  id?: string | null;
  isAnnual?: boolean;
  title?: string | null;
  price?: string | null;
};
