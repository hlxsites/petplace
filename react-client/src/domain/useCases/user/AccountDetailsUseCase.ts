import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { readJwtClaim } from "~/util/authUtil";
import { AccountDetailsModel } from "../../models/user/UserModels";
import { AccountDetailsRepository } from "../../repository/user/AccountDetailsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

const serverPutRequestSchema = z.object({
  FirstName: z.string().nullish(),
  LastName: z.string().nullish(),
  PhoneNumber: z.string().nullish(),
  ZipCode: z.string().nullish(),
});

export type PutAccountDetailsRequest = z.infer<typeof serverPutRequestSchema>;

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
    try {
      const result = await this.httpClient.get("adopt/api/User");
      if (result.data) return convertToAccountDetailsModel(result.data);

      return null;
    } catch (error) {
      console.error("AccountDetailsUseCase query error", error);
      return null;
    }
  };

  mutate = async (data: AccountDetailsModel): Promise<boolean> => {
    const zipCode = readJwtClaim()?.postalCode;
    const body = convertToServerAccountDetails(data, zipCode);

    try {
      if (serverPutRequestSchema.safeParse(body).success) {
        const result = await this.httpClient.put("adopt/api/User", {
          body: JSON.stringify(body),
        });

        if (result.statusCode === 204) return true;
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

    console.error("Error parsing user data", { userData, error });
    return null;
  };

  const user = parseUserDetailsData(data);
  if (!user) return null;
  const { Email, FirstName, LastName, PhoneNumber } = user;

  return {
    email: Email ?? "",
    name: FirstName ?? "",
    phoneNumber: PhoneNumber ?? "",
    surname: LastName ?? "",
  };
}

function convertToServerAccountDetails(
  data: AccountDetailsModel,
  zipCode?: string
): PutAccountDetailsRequest {
  return {
    FirstName: data.name ?? "",
    PhoneNumber: data.phoneNumber ? data.phoneNumber.split("|")[0] : "",
    LastName: data.surname ?? "",
    ZipCode: zipCode ?? "00000",
  };
}
