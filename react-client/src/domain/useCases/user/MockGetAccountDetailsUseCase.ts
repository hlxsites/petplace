import { AccountDetailsModel } from "~/domain/models/user/UserModels";
import { GetAccountDetailsRepository } from "../../repository/user/GetAccountDetailsRepository";

export class MockGetUserUseCase implements GetAccountDetailsRepository {
  async query(): Promise<AccountDetailsModel> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      email: "johene@email.com",
      name: "Johene",
      phoneNumber: "(234) 123-4566",
      surname: "Smith",
      zipCode: "09889",
    };
  }
}
