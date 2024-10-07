import { AccountEmergencyContactModel } from "~/domain/models/user/UserModels";
import { AccountEmergencyContactsRepository } from "~/domain/repository/user/AccountEmergencyContactsRepository";

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
      },
    ];
  }

  async mutate(): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}
