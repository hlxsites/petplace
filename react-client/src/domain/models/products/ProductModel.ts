type RequiredLabelID = {
  label: string;
  id: string;
};

export type ProductDescription = {
  availableColors?: RequiredLabelID[];
  availableSizes?: RequiredLabelID[];
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
