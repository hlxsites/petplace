import { z } from "zod";

export const serverInternalAccountSchema = z.object({
  FirstName: z.string().nullish(),
  LastName: z.string().nullish(),
  PhoneNumber: z.string().nullish(),
  ZipCode: z.string().nullish(),
});

export const serverExternalAccountSchema = z.object({
  Address: z.object({
    Unit: z.string().nullish(),
    Street: z.string().nullish(),
    City: z.string().nullish(),
    PostalCode: z.string().nullish(),
    Country: z.string().nullish(),
    StateProvince: z.string().nullish(),
  }),
  Email: z.string().nullish(),
  FirstName: z.string().nullish(),
  LastName: z.string().nullish(),
  ZipCode: z.string().nullish(),
  PhoneType: z.string().nullish(),
  PhoneNumber: z.string().nullish(),
  HomePhone: z.string().nullish(),
  BusinessPhone: z.string().nullish(),
  CellularPhone: z.string().nullish(),
  ContactConsent: z.boolean(),
  InformationReleaseConsent: z.boolean(),
});

export type PutExternalAccountDetailsRequest = z.infer<
  typeof serverExternalAccountSchema
>;
export type PutInternalAccountDetailsRequest = z.infer<
  typeof serverInternalAccountSchema
>;
