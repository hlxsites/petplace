export type ProductOption = {
  id: string;
  price: string;
};

export type ProductDescription = {
  availableColors: string[];
  availableSizes: string[];
  availableOptions: Record<string, ProductOption>;
  description?: string | null;
  id: string;
  images: string[];
  isAnnual?: boolean;
  title: string;
};

export type DetailedCartItem = ProductDescription & {
  additionalInfo?: string;
  privacyFeatures?: string;
  sizing?: string;
  tagFeatures?: string[];
};