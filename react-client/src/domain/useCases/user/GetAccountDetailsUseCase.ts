import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { checkIsExternalLogin } from "~/util/authUtil";
import { AccountDetailsModel, ExternalAccountDetailsModel, InternalAccountDetailsModel } from "../../models/user/UserModels";
import { GetAccountDetailsRepository } from "../../repository/user/GetAccountDetailsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

export class GetAccountDetailsUseCase implements GetAccountDetailsRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  async query(): Promise<AccountDetailsModel | null> {
    const isExternalLogin = checkIsExternalLogin()

    try {
      let result;

      if (isExternalLogin) {
        result = await this.httpClient.get("adopt/api/UserProfile");
        if (result.data) return convertToExternalAccountDetailsModel(result.data);

      } else {
        result = await this.httpClient.get("adopt/api/User");
        if (result.data) return convertToInternalAccountDetailsModel(result.data);
      }

      return null;
    } catch (error) {
      console.error("GetAccountDetailsUseCase query error", error);
      return null;
    }
  };
}

function convertToInternalAccountDetailsModel(
  data: unknown
): InternalAccountDetailsModel | null {
  if (!data) return null;

  const serverResponseSchema = z.object({
    Email: z.string().nullish(),
    FirstName: z.string().nullish(),
    LastName: z.string().nullish(),
    PhoneNumber: z.string().nullish(),
  });

  const parseUserDetailsData = (userData: unknown) => {
    const { data, error, success } = serverResponseSchema.safeParse(userData);
    if (success) return data;

    console.error("Error parsing internal user data", { userData, error });
    return null;
  };

  const user = parseUserDetailsData(data);
  if (!user) return null;
  const { Email, FirstName, LastName, PhoneNumber } = user;

  return {
    email: Email ?? "",
    name: FirstName ?? "",
    defaultPhone: PhoneNumber ? `${PhoneNumber}|Home` : "",
    surname: LastName ?? "",
  };
}


function convertToExternalAccountDetailsModel(
  data: unknown
): ExternalAccountDetailsModel | null {
  if (!data) return null;

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

  const parseAddressData = (addressData: unknown) => {
    const { data, error, success } =
      serverResponseSchema.safeParse(addressData);
    if (success) return data;

    console.error("Error parsing external user data", { addressData, error });
    return null;
  };

  const address = parseAddressData(data);
  if (!address) return null;

  const {
    Address: {
      City,
      Country,
      Intersection,
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
      intersection: Intersection ?? "",
      state: StateProvince ?? "",
      zipCode: PostalCode ?? "",
    },
    contactConsent: ContactConsent,
    email: Email,
    informationConsent: InformationReleaseConsent,
    name: FirstName,
    defaultPhone:
      PhoneNumber && PhoneType
        ? `${PhoneNumber}|${managePhoneTypes()}`
        : "",
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