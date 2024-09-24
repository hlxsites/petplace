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
        name: "Alaska",
        phoneNumber: "(234) 123-4566",
        surname: "Thunder",
      },
    ];
  }

  async mutate(data: AccountEmergencyContactModel[]): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data
    return true;
  }
}
