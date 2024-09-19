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

const annualMembershipSchema = z.object({
  itemId: z.string().optional(),
  salesPrice: z.string().optional(),
  renewPrice: z.string().optional(),
  additionalProductList: z.array(commonProductSpecificationSchema).optional(),
  autoRenew: z.boolean().optional(),
});

const lpmMembershipSchema = z.object({
  itemId: z.string().optional(),
  itemPrice: z.string().optional(),
  autoRenew: z.boolean().optional(),
});

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
  tags: tagCheckoutProductSchema.nullish(),
});

export const checkoutModelSchema = z.object({
  country: z.string().optional(),
  membershipProducts: membershipProductsSchema.nullish(),
});
