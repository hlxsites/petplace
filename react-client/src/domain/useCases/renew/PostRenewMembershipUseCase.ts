import { z } from "zod";
import { RenewMembershipModel } from "~/domain/models/renew/RenewMembershipModel";
import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { PostRenewMembershipRepository } from "~/domain/repository/renew/PostRenewMembershipRepository";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { PetPlaceHttpClientUseCase } from "../PetPlaceHttpClientUseCase";

const renewMembershipServerSchema = z.object({
  AnimalId: z.string().nullish(),
  AutoRenew: z.boolean().nullish(),
  ItemId: z.string().nullish(),
});

type PostRenewMembershipRequest = z.infer<typeof renewMembershipServerSchema>;

export class PostRenewMembershipUseCase
  implements PostRenewMembershipRepository
{
  private httpClient: HttpClientRepository;

  constructor(authToken: string, httpClient?: HttpClientRepository) {
    if (httpClient) {
      this.httpClient = httpClient;
    } else {
      this.httpClient = new PetPlaceHttpClientUseCase(authToken);
    }
  }

  post = async (data: RenewMembershipModel): Promise<boolean> => {
    try {
      const body = convertToServerRenewMembership(data);

      const response = await this.httpClient.post("api/Checkout/renew", {
        body: JSON.stringify(body),
      });

      return !!response.success;
    } catch (error) {
      logError("PostRenewMembershipUseCase post error", error);
    }
    return false;
  };
}

function convertToServerRenewMembership(
  data: RenewMembershipModel
): PostRenewMembershipRequest {
  return {
    AnimalId: data.petId,
    AutoRenew: data.autoRenew,
    ItemId: data.id,
  };
}
