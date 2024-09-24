import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountEmergencyContactModel } from "../../models/user/UserModels";
import { GetAccountEmergencyContactsRepository } from "../../repository/user/GetAccountEmergencyContactsRepository";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

const serverResponseSchema = z.object({
  FirstName: z.string().nullish(),
  Email: z.string().nullish(),
  LastName: z.string().nullish(),
  PhoneNumber: z.string().nullish(),
});

type PutAccountEmergencyContactRequest = z.infer<typeof serverResponseSchema>

export class GetAccountEmergencyContactsUseCase implements GetAccountEmergencyContactsRepository {
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<AccountEmergencyContactModel[] | []> => {
    try {
      const result = await this.httpClient.get("adopt/api/UserProfile/EmergencyContacts");
      if (result.data) return convertToAccountEmergencyContact(result.data);

      return [];
    } catch (error) {
      console.error("GetUserUseCase query error", error);
      return [];
    }
  }

  mutate = async (data: AccountEmergencyContactModel[]): Promise<boolean> => {
    const body = convertToServerEmergencyContact(data);
    const isValid = body.every((contact) => serverResponseSchema.safeParse(contact).success)

    try {
      if (isValid) {
        const result = await this.httpClient.post("adopt/api/UserProfile/EmergencyContacts", {
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

function convertToAccountEmergencyContact(
  data: unknown
): AccountEmergencyContactModel[] | [] {
  if (!data|| !Array.isArray(data)) return [];

  let list: AccountEmergencyContactModel[] = [];

  data.forEach((contactData) => {
    const contact = parseData(serverResponseSchema, contactData);

    if (!contact) return;

    list.push({
      email: contact.Email ?? "",
      name: contact.FirstName ?? "",
      surname: contact.LastName ?? "",
      phoneNumber: contact.PhoneNumber ?? "",
    })
  })

  if (list.length > 2) list = list.slice(list.length - 2)

  return list.reverse();
}

function convertToServerEmergencyContact(
  data: AccountEmergencyContactModel[]
): PutAccountEmergencyContactRequest[] | [] {
  return data.map((contact) => ({
    Email: contact.email,
    FirstName: contact.name,
    LastName: contact.surname,
    PhoneNumber: contact.phoneNumber,
  }));
}