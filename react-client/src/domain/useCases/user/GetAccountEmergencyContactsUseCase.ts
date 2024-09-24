import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountEmergencyContactModel } from "../../models/user/UserModels";
import { GetAccountEmergencyContactsRepository } from "../../repository/user/GetAccountEmergencyContactsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

export class GetAccountEmergencyContactsUseCase implements GetAccountEmergencyContactsRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  async query(): Promise<AccountEmergencyContactModel[] | []> {
    try {
      const result = await this.httpClient.get("adopt/api/UserProfile/EmergencyContacts");
      if (result.data) return convertToAccountEmergencyContact(result.data);

      return [];
    } catch (error) {
      console.error("GetUserUseCase query error", error);
      return [];
    }
  }
}

function convertToAccountEmergencyContact(
  data: unknown
): AccountEmergencyContactModel[] | [] {
  if (!data|| !Array.isArray(data)) return [];

  const serverResponseSchema = z.object({
    ContactPersonId: z.string(),
    FirstName: z.string().nullish(),
    Email: z.string().nullish(),
    LastName: z.string().nullish(),
    PhoneNumber: z.string().nullish(),
  });

  let list: AccountEmergencyContactModel[] = [];

  data.forEach((contactData) => {
    const contact = parseData(serverResponseSchema, contactData);

    if (!contact) return;

    list.push({
      email: contact.Email ?? "",
      id: contact.ContactPersonId,
      name: contact.FirstName ?? "",
      surname: contact.LastName ?? "",
      phoneNumber: contact.PhoneNumber ?? "",
    })
  })

  if (list.length > 2) list = list.slice(list.length - 2)

  return list.reverse();
}
