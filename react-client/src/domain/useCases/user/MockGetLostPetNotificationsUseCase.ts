import { LostPetUpdateModel } from "~/domain/models/user/UserModels";
import { GetLostPetNotificationsRepository } from "../../repository/user/GetLostPetNotificationsRepository";

export class MockGetLostPetNotificationsUseCase
  implements GetLostPetNotificationsRepository
{
  async query(): Promise<LostPetUpdateModel[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        communicationId: "1234567",
        date: "2024-07-17T10:08:41.857",
        id: "1234567",
        note: "Lost report from submitted",
        status: "missing",
        petId: "AUN19623620",
        petName: "Billy",
        update: "2024-07-19T00:03:07.17",
      },
      {
        communicationId: "2234567",
        date: "2024-07-18T10:08:41.857",
        id: "2234567",
        note: "",
        status: "found",
        petId: "AUN19623620",
        petName: "Billy",
        update: "2024-07-21T00:03:07.17",
      },
    ];
  }
}
