import { z } from "zod";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { AccountEmergencyContactsRepository } from "~/domain/repository/user/AccountEmergencyContactsRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { AccountEmergencyContactModel } from "../../models/user/UserModels";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";
import { parseData } from "../util/parseData";

const serverSchema = z.object({
  FirstName: z.string().nullish(),
  Email: z.string().nullish(),
  LastName: z.string().nullish(),
  PhoneNumber: z.string().nullish(),
  ContactPersonId: z.string().nullish(),
  StagingIdentifier: z.number().nullish(),
});

type PutAccountEmergencyContactRequest = z.infer<typeof serverSchema>;

export class AccountEmergencyContactsUseCase
  implements AccountEmergencyContactsRepository
{
  private httpClient: HttpClientRepository;
  private endpoint: string = "adopt/api/UserProfile/EmergencyContact";

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  query = async (): Promise<AccountEmergencyContactModel[] | []> => {
    try {
      const result = await this.httpClient.get(`${this.endpoint}s`);
      if (result.data) return convertToAccountEmergencyContact(result.data);

      return [];
    } catch (error) {
      logError("AccountEmergencyContactsUseCase query error", error);
      return [];
    }
  };

  mutate = async (data: AccountEmergencyContactModel[]): Promise<boolean> => {
    try {
      const body = convertToServerEmergencyContact(data);
      const isValid = body.every(
        (contact) => serverSchema.safeParse(contact).success
      );
      if (!isValid) return false;

      const result = await this.httpClient.post(`${this.endpoint}s`, {
        body: JSON.stringify(body),
      });

      return !!result.statusCode && !result.error;
    } catch (error) {
      logError("AccountEmergencyContactsUseCase mutation error", error);
    }
    return false;
  };

  delete = async (data: AccountEmergencyContactModel): Promise<boolean> => {
    const body = {
      ContactPersonId: data.contactId ?? "",
      StagingIdentifier: data.stagingId ?? 0,
    };

    try {
      const result = await this.httpClient.put(this.endpoint, {
        body: JSON.stringify(body),
      });

      return !!result.statusCode && !result.error;
    } catch (error) {
      logError("AccountEmergencyContactsUseCase deletion error", error);
    }
    return false;
  };
}

function convertToAccountEmergencyContact(
  data: unknown
): AccountEmergencyContactModel[] | [] {
  if (!data || !Array.isArray(data)) return [];

  const list: AccountEmergencyContactModel[] = [];

  data.forEach((contactData) => {
    const contact = parseData(serverSchema, contactData);
    if (!contact) return;

    list.push({
      contactId: contact.ContactPersonId ?? "",
      email: contact.Email ?? "",
      name: contact.FirstName ?? "",
      surname: contact.LastName ?? "",
      phoneNumber: contact.PhoneNumber ?? "",
      stagingId: contact.StagingIdentifier ?? 0,
    });
  });

  return list.reverse();
}

function convertToServerEmergencyContact(
  data: AccountEmergencyContactModel[]
): PutAccountEmergencyContactRequest[] {
  return data.map((contact) => ({
    ContactPersonId: contact.contactId,
    Email: contact.email,
    FirstName: contact.name,
    LastName: contact.surname,
    PhoneNumber: contact.phoneNumber,
    StagingIdentifier: contact.stagingId,
  }));
}
