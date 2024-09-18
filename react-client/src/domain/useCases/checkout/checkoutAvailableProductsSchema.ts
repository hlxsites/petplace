import { z } from "zod";

const baseProductSchema = z.object({
  itemName: z.string().optional(),
  itemId: z.string().optional(),
  itemType: z.string().optional(),
  price: z.string().optional(),
});

const commonProductSpecificationSchema = baseProductSchema.extend({
  uiName: z.string().nullish(),
});

const annualMembershipSchema = baseProductSchema.omit({ price: true }).extend({
  salesPrice: z.string().optional(),
  renewPrice: z.string().optional(),
  additionalProductList: z.array(commonProductSpecificationSchema).optional(),
});

const lpmMembershipSchema = baseProductSchema.extend({
  bundleList: z.array(commonProductSpecificationSchema).optional(),
});

const subscriptionProductSchema = commonProductSpecificationSchema
  .omit({ itemType: true })
  .extend({
    isIncludedInPlan: z.boolean().optional(),
    isSubscribed: z.boolean().optional(),
  })
  .nullable();

const byteTagSchema = baseProductSchema.extend({
  shape: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  speciesId: z.string().optional(),
});

const lifetimeTagSchema = baseProductSchema.extend({
  shape: z.string().optional(),
  size: z.string().optional(),
});

const standardTagSchema = baseProductSchema.extend({
  shape: z.string().optional(),
  color: z.string().optional(),
});

const tagCheckoutProductSchema = z
  .object({
    byteTagList: z.array(byteTagSchema).optional(),
    lifetimeTagList: z.array(lifetimeTagSchema).optional(),
    standardTagList: z.array(standardTagSchema).optional(),
  })
  .nullable();

const membershipProductsSchema = z.object({
  annualMembership: annualMembershipSchema.nullish(),
  lpmMembership: lpmMembershipSchema.nullish(),
  lpmPlusMembership: lpmMembershipSchema.nullish(),
  subscriptions: subscriptionProductSchema.nullish(),
  tags: tagCheckoutProductSchema.nullish(),
});

export const checkoutModelSchema = z.object({
  membershipProducts: membershipProductsSchema.nullish(),
});
