import { AccountEmergencyContactModel } from "~/domain/models/user/UserModels";
import { AccountEmergencyContactsRepository } from "../../repository/user/AccountEmergencyContactsRepository";

export class MockAccountEmergencyContactUseCase
  implements AccountEmergencyContactsRepository
{
  delete(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  }

  async query(): Promise<AccountEmergencyContactModel[]> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        contactId: "",
        email: "alaska@email.com",
        name: "Alaska",
        phoneNumber: "(234) 123-4566",
        stagingId: 0,
        surname: "Thunder",
        stagingId: 0,
      },
    ];
  }

  async mutate(): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(_data: AccountEmergencyContactModel): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}
