import { AccountEmergencyContactModel } from "~/domain/models/user/UserModels";
import { GetAccountEmergencyContactsRepository } from "../../repository/user/GetAccountEmergencyContactsRepository";

export class MockGetAccountEmergencyContactUseCase
  implements GetAccountEmergencyContactsRepository
{
  async query(): Promise<AccountEmergencyContactModel[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        email: "alaska@email.com",
        id: "098893232",
        name: "Alaska",
        phoneNumber: "(234) 123-4566",
        surname: "Thunder",
      },
    ];
  }
}
