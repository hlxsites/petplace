import { LostPetUpdateModel } from "~/domain/models/pet/PetModel";

export interface GetLostPetNotificationDetailsRepository {
  query(notification: LostPetUpdateModel): Promise<LostPetUpdateModel | null>;
}
