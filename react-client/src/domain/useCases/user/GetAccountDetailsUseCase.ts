import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountDetailsModel } from "../../models/user/UserModels";
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
    try {
      const result = await this.httpClient.get("User");
      if (result.data) return convertToAccountDetailsModel(result.data);

      return null;
    } catch (error) {
      console.error("GetUserUseCase query error", error);
      return null;
    }
  }
}

function convertToAccountDetailsModel(
  data: unknown
): AccountDetailsModel | null {
  if (!data) return null;

  const serverResponseSchema = z.object({
    Email: z.string(),
    FirstName: z.string(),
    LastName: z.string(),
    PhoneNumber: z.string(),
    ZipCode: z.string(),
  });

  const parseUserDetailsData = (userData: unknown) => {
    const { data, error, success } = serverResponseSchema.safeParse(userData);
    if (success) return data;

    console.error("Error parsing user data", { userData, error });
    return null;
  };

  const user = parseUserDetailsData(data);
  if (!user) return null;
  return {
    email: user.Email,
    name: user.FirstName,
    phoneNumber: user.PhoneNumber,
    surname: user.LastName,
    zipCode: user.ZipCode,
  };
}
