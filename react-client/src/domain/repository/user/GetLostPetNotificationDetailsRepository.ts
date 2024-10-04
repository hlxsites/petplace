import { LostPetUpdateModel } from "~/domain/models/user/UserModels";

export interface GetLostPetNotificationDetailsRepository {
  query(notification: LostPetUpdateModel): Promise<LostPetUpdateModel | null>;
}
