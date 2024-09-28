import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { checkIsExternalLogin } from "~/util/authUtil";
import {
  AccountDetailsModel,
  ExternalAccountDetailsModel,
} from "../../models/user/UserModels";
import { AccountDetailsRepository } from "../../repository/user/AccountDetailsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

const serverSchema = z.object({
  FirstName: z.string().nullish(),
  LastName: z.string().nullish(),
  PhoneNumber: z.string().nullish(),
  ZipCode: z.string().nullish(),
});

export type PutAccountDetailsRequest = z.infer<typeof serverSchema>;

const BASE_URL = "adopt/api/User";

export class AccountDetailsUseCase implements AccountDetailsRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<AccountDetailsModel | null> => {
    const isInternalLogin = !checkIsExternalLogin();

    try {
      let result = await this.httpClient.get("adopt/api/User");
      let accountDetails: AccountDetailsModel | null;
      if (result.data) {
        accountDetails = convertToInternalAccountDetailsModel(result.data);
        if (isInternalLogin) return accountDetails;

        // The server doesn't update name and surname for the API of external login,
        // so we use the values from the internal login API
        result = await this.httpClient.get("adopt/api/UserProfile");
        if (result.data) {
          accountDetails = {
            ...convertToExternalAccountDetailsModel(result.data),
            name: accountDetails?.name ?? "",
            surname: accountDetails?.surname ?? "",
          };
          return accountDetails;
        }
      }

      return null;
    } catch (error) {
      console.error("AccountDetailsUseCase query error", error);
      return null;
    }
  };

  mutate = async (data: AccountDetailsModel): Promise<boolean> => {
    const body = convertToServerAccountDetails(data);

    try {
      const result = await this.httpClient.put(BASE_URL, {
        body: JSON.stringify(body),
      });

      if (!result.statusCode) return false;
      return result.statusCode >= 200 && result.statusCode < 300;
    } catch (error) {
      console.error("AccountDetailsUseCase mutation error", error);
      return false;
    }
  };
}

function convertToInternalAccountDetailsModel(
  data: unknown
): AccountDetailsModel | null {
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

function convertToServerAccountDetails(
  data: AccountDetailsModel
): PutAccountDetailsRequest {
  return {
    FirstName: data.name ?? "",
    PhoneNumber: data.defaultPhone ? data.defaultPhone.split("|")[0] : "",
    LastName: data.surname ?? "",
    // TODO: check if this is required
    ZipCode: "00000",
  };
}

function convertToExternalAccountDetailsModel(
  data: unknown
): ExternalAccountDetailsModel | null {
  const serverResponseSchema = z.object({
    Address: z
      .object({
        Unit: z.string().nullish(),
        Street: z.string().nullish(),
        Intersection: z.string().nullish(),
        City: z.string().nullish(),
        PostalCode: z.string().nullish(),
        Country: z.string().nullish(),
        StateProvince: z.string().nullish(),
      })
      .nullish(),
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
    Address,
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

  const {
    City,
    Country,
    Intersection,
    PostalCode,
    StateProvince,
    Street,
    Unit,
  } = Address ?? {};

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
      PhoneNumber && PhoneType ? `${PhoneNumber}|${managePhoneTypes()}` : "",
    secondaryPhone: findSecondaryPhoneNumber(),
    surname: LastName,
  };

  function managePhoneTypes() {
    const type: string = PhoneType.replace("Phone", "");

    switch (type) {
      case "Business":
        return "Work";
      case "Cellular":
        return "Mobile";
      default:
        return "Home";
    }
  }

  function findSecondaryPhoneNumber() {
    if (BusinessPhone?.length && BusinessPhone !== PhoneNumber) {
      return `${BusinessPhone}|Work`;
    }
    if (CellularPhone?.length && CellularPhone !== PhoneNumber) {
      return `${CellularPhone}|Mobile`;
    }
    if (HomePhone?.length && HomePhone !== PhoneNumber) {
      return `${HomePhone}|Home`;
    }
    return "";
  }
}
