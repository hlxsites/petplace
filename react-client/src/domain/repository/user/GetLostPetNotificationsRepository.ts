import { LostPetUpdateModel } from "~/domain/models/user/UserModels";

export interface GetLostPetNotificationsRepository {
  query(): Promise<LostPetUpdateModel[]>;
}
