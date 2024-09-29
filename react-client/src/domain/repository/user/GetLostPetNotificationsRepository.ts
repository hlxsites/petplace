import { LostPetUpdateModel } from "../../models/user/UserModels";

export interface GetLostPetNotificationsRepository {
  query(): Promise<LostPetUpdateModel[]>;
}
