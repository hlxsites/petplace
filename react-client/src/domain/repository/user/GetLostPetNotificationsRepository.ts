import { LostPetUpdateModel } from "~/domain/models/pet/PetModel";

export interface GetLostPetNotificationsRepository {
  query(): Promise<LostPetUpdateModel[]>;
}
