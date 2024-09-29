import { LostPetUpdateModel } from "~/domain/models/user/UserModels";
import { GetLostPetNotificationDetailsRepository } from "../../repository/user/GetLostPetNotificationDetailsRepository";

export class MockGetLostPetNotificationDetailsUseCase
  implements GetLostPetNotificationDetailsRepository
{
  async query(): Promise<LostPetUpdateModel | null> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      communicationId: "1234567",
      date: 1722300534,
      id: "1234567",
      note: "Lost report from submitted",
      status: "missing",
      petId: "AUN19623620",
      petName: "Billy",
      update: 1722354747,
      foundedBy: {
        finderName: "Nico",
        finderPhoneNumber: "987-666-5432",
        finderOrganization: "Lucico",
        contact: [{ date: 628021800000, email: "Hellen Badu" }],
      },
    };
  }
}
