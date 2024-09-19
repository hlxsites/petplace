type BaseProduct = {
  itemName?: string;
  itemId?: string;
  itemType?: string;
  price?: string;
};

type CommonProductSpecification = BaseProduct & {
  uiName?: string | null;
};

type BaseTag = BaseProduct & {
  shape?: string;
};

type StandardTag = BaseTag & {
  color?: string;
};

type LifetimeTag = BaseTag & {
  size?: string;
};

type ByteTag = BaseTag & {
  color?: string;
  shape?: string;
  size?: string;
  speciesId?: string;
};

type AnnualMembership = Omit<BaseProduct, "price"> & {
  salesPrice?: string;
  renewPrice?: string;
  additionalProductList?: CommonProductSpecification[];
  autoRenew?: boolean;
};

type LpmMembership = BaseProduct & {
  bundleList?: CommonProductSpecification[];
  autoRenew?: boolean;
};

type LpmPlusMembership = BaseProduct & {
  bundleList?: CommonProductSpecification[];
  autoRenew?: boolean;
};

type SubscriptionProduct = Omit<CommonProductSpecification, "itemType"> & {
  isIncludedInPlan?: boolean;
  isSubscribed?: boolean;
};

type TagCheckoutProduct = {
  byteTagList?: ByteTag[];
  lifetimeTagList?: LifetimeTag[];
  standardTagList?: StandardTag[];
};

export type CheckoutModel = {
  membershipProducts?: {
    annualMembership?: AnnualMembership | null;
    lifetimeMembership?: LpmMembership | null;
    lifetimePlusMembership?: LpmPlusMembership | null;
    subscriptions?: SubscriptionProduct | null;
    tags?: TagCheckoutProduct | null;
  } | null;
};
