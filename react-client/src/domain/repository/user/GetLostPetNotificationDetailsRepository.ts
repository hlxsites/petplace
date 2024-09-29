import { LostPetUpdateModel } from "../../models/user/UserModels";

export interface GetLostPetNotificationDetailsRepository {
  query(notification: LostPetUpdateModel): Promise<LostPetUpdateModel | null>;
}
