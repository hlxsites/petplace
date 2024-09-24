import { AccountDetailsModel } from "~/domain/models/user/UserModels";
import { AccountDetailsRepository } from "../../repository/user/AccountDetailsRepository";

export class MockAccountDetailsCase implements AccountDetailsRepository {
  async query(): Promise<AccountDetailsModel> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      email: "johene@email.com",
      name: "Johene",
      phoneNumber: "(234) 123-4566",
      surname: "Smith",
      zipCode: "01234",
    };
  }

  async mutate(data: AccountDetailsModel): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data
    return true;
  }
}
