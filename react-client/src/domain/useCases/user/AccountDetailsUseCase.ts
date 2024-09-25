import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { checkIsExternalLogin, readJwtClaim } from "~/util/authUtil";
import { AccountDetailsModel, ExternalAccountDetailsModel, } from "../../models/user/UserModels";

import { AccountDetailsRepository } from "~/domain/repository/user/AccountDetailsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

const serverInternalAccountSchema = z.object({
  FirstName: z.string().nullish(),
  LastName: z.string().nullish(),
  PhoneNumber: z.string().nullish(),
  ZipCode: z.string().nullish(),
});

const serverExternalAccountSchema = z.object({
  Address: z.object({
    Unit: z.string().nullish(),
    Street: z.string().nullish(),
    City: z.string().nullish(),
    PostalCode: z.string().nullish(),
    Country: z.string().nullish(),
    StateProvince: z.string().nullish()
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
  InformationReleaseConsent: z.boolean()
});

export type PutExternalAccountDetailsRequest = z.infer<typeof serverExternalAccountSchema>;
export type PutInternalAccountDetailsRequest = z.infer<typeof serverInternalAccountSchema>;

export class AccountDetailsUseCase implements AccountDetailsRepository {
  private httpClient: HttpClientRepository;
  private isInternalLogin = !checkIsExternalLogin()

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  async query(): Promise<AccountDetailsModel | null> {

    try {
      let result = await this.httpClient.get("adopt/api/User");
      let accountDetails: AccountDetailsModel | null;
      if (result.data) {
        accountDetails = convertToAccountDetailsModel(result.data);
        if(this.isInternalLogin) return accountDetails

        // The server doesn't update name and surname for the API of external login,
        // so we use the values from the internal login API
        result = await this.httpClient.get("adopt/api/UserProfile");
        if (result.data){
          accountDetails = {
            ...convertToExternalAccountDetailsModel(result.data),
            name: accountDetails?.name,
            surname: accountDetails?.surname
          };
          return accountDetails
        }
      }

      return null;
    } catch (error) {
      console.error("AccountDetailsUseCase query error", error);
      return null;
    }
  };

  mutate = async (data: AccountDetailsModel): Promise<boolean> => {
    const zipCode = readJwtClaim()?.postalCode;
    let internalAccountBody = convertToServerInternalAccountDetails(data, zipCode);

    try {
      if (serverInternalAccountSchema.safeParse(internalAccountBody).success) {
        const result = await this.httpClient.put("adopt/api/User", {
          body: JSON.stringify(internalAccountBody),
        });

        if (result.statusCode === 204 && this.isInternalLogin) return true;

        if(!this.isInternalLogin){
          let externalAccountBody = convertToServerExternalAccountDetails(data as ExternalAccountDetailsModel);
          const result2 = await this.httpClient.put("adopt/api/UserProfile", {
            body: JSON.stringify(externalAccountBody),
          });

          if (result.statusCode === 204 && result2.statusCode === 204) return true;
        }
      }

      return false;
    } catch (error) {
      console.error("AccountDetailsUseCase mutation error", error);
      return false;
    }
  };
}

function convertToAccountDetailsModel(
  data: unknown
): AccountDetailsModel | null {
  const serverResponseSchema = z.object({
    Email: z.string().nullish(),
    FirstName: z.string().nullish(),
    LastName: z.string().nullish(),
    PhoneNumber: z.string().nullish(),
  });

  const user = parseData(serverResponseSchema, data);
  if (!user) return null;
  const { Email, FirstName, LastName, PhoneNumber } = user;

  return {
    email: Email ?? "",
    name: FirstName ?? "",
    defaultPhone: PhoneNumber ? `${PhoneNumber}|Home` : "",
    surname: LastName ?? "",
  };
}

function convertToServerInternalAccountDetails(
  data: AccountDetailsModel,
  zipCode?: string | null
): PutInternalAccountDetailsRequest {
  return {
    FirstName: data.name ?? "",
    PhoneNumber: data.defaultPhone ? data.defaultPhone.split("|")[0] : "",
    LastName: data.surname ?? "",
    ZipCode: zipCode ?? "00000",
  };
}

function convertToExternalAccountDetailsModel(
  data: unknown
): ExternalAccountDetailsModel | null {
  const serverResponseSchema = z.object({
    Address: z.object({
      Unit: z.string().nullish(),
      Street: z.string().nullish(),
      Intersection: z.string().nullish(),
      City: z.string().nullish(),
      PostalCode: z.string().nullish(),
      Country: z.string().nullish(),
      StateProvince: z.string().nullish(),
    }),
    BusinessPhone: z.string().nullish(),
    CellularPhone: z.string().nullish(),
    ContactConsent: z.boolean(),
    Email: z.string(),
    FirstName: z.string(),
    HomePhone: z.string().nullish(),
    InformationReleaseConsent: z.boolean(),
    LastName: z.string(),
    PhoneNumber: z.string(),
    PhoneType: z.string(),
  });

  const address = parseData(serverResponseSchema, data);
  if (!address) return null;

  const {
    Address: {
      City,
      Country,
      PostalCode,
      StateProvince,
      Street,
      Unit,
    },
    BusinessPhone,
    CellularPhone,
    ContactConsent,
    Email,
    FirstName,
    HomePhone,
    InformationReleaseConsent,
    LastName,
    PhoneNumber,
    PhoneType,
  } = address;

  return {
    address: {
      address1: Street ?? "",
      address2: Unit ?? "",
      city: City ?? "",
      country: Country ?? "",
      state: StateProvince ?? "",
      zipCode: PostalCode ?? "",
    },
    contactConsent: ContactConsent,
    defaultPhone:
      PhoneNumber && PhoneType
        ? `${PhoneNumber}|${managePhoneTypes()}`
        : "",
    email: Email,
    informationConsent: InformationReleaseConsent,
    name: FirstName,
    secondaryPhone: findSecondaryPhoneNumber(),
    surname: LastName,
  };

  function managePhoneTypes(){
    let type: string = PhoneType.replace("Phone", "")

    switch(type) {
      case "Business":
        return "Work";
      case "Cellular":
        return "Mobile";
      default: return "Home";
    }
  }

  function findSecondaryPhoneNumber(){
    if (BusinessPhone?.length && BusinessPhone !== PhoneNumber) return `${BusinessPhone}|Work`
    if (CellularPhone?.length && CellularPhone !== PhoneNumber) return `${CellularPhone}|Mobile`
    if (HomePhone?.length && HomePhone !== PhoneNumber) return `${HomePhone}|Home`
    return ""
  }
}

function convertToServerExternalAccountDetails(
  data: ExternalAccountDetailsModel,
): PutExternalAccountDetailsRequest {
  const address = {
    City: data.address?.city,
    Country: data.address?.country,
    PostalCode: data.address?.zipCode,
    StateProvince: data.address?.state,
    Street: data.address?.address1,
    Unit: data.address?.address2,

  }

  const [defaultPhone, defaultType] = data.defaultPhone?.split("|") ?? ["", ""]


  function managePhoneTypes(){
    let phoneType;
    switch(defaultType) {
      case "Mobile":
        phoneType = "Cellular";
        break
      case "Work":
        phoneType = "Business";
        break
      default: phoneType = "Home";
    }

    return phoneType.concat("Phone")
  }

  function manageSecondaryPhone(){
    const [phone, type] = data.secondaryPhone?.split("|") ?? ["", ""]
    const phones = {
      BusinessPhone: "",
      CellularPhone: "",
      HomePhone: "",}

      switch(type) {
        case "Phone":
          phones.CellularPhone = phone;
          break
        case "Work":
          phones.BusinessPhone = phone;
          break
        default:
          phones.HomePhone = phone;
      }

      return phones
  }

  return {
    PhoneNumber: data.defaultPhone ? defaultPhone : "",
    PhoneType: managePhoneTypes(),
    Address: address,
    ContactConsent: data.contactConsent ?? false,
    InformationReleaseConsent: data.informationConsent ?? false,
    ...manageSecondaryPhone()
  };
}