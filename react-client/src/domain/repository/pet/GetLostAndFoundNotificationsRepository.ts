import { LostAndFountNotification } from "../../models/pet/PetModel";

export interface GetLostAndFoundNotificationsRepository {
  query(id: string): Promise<LostAndFountNotification[]>;
}
