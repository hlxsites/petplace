export type ProductDescription = {
  availableColors?: string[];
  availableSizes?: string[];
  description?: string | null;
  id: string;
  images: string[];
  isAnnual?: boolean;
  title: string;
  price: string;
};

export type DetailedCartItem = ProductDescription & {
  additionalInfo?: string;
  privacyFeatures?: string;
  sizing?: string;
  tagFeatures?: string[];
};
