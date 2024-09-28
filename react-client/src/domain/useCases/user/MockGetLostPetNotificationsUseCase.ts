import { LostPetUpdateModel } from "~/domain/models/user/UserModels";
import { GetLostPetNotificationsRepository } from "../../repository/user/GetLostPetNotificationsRepository";

export class MockGetLostPetNotificationsUseCase
  implements GetLostPetNotificationsRepository
{
  async query(): Promise<LostPetUpdateModel[] | []> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        communicationId: "1234567",
        date: 1722300534,
        id: "1234567",
        note: "Lost report from submitted",
        status: "missing",
        petId: "AUN19623620",
        petName: "Billy",
        update: 1722354747,
      },
      {
        communicationId: "2234567",
        date: 628021800000,
        id: "2234567",
        note: "",
        status: "found",
        petId: "AUN19623620",
        petName: "Billy",
        update: 1722460747,
      },
    ];
  }
}
