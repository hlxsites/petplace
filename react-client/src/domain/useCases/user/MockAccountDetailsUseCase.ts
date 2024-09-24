import { AccountDetailsModel } from "~/domain/models/user/UserModels";
import { AccountDetailsRepository } from "../../repository/user/AccountDetailsRepository";

export class MockAccountDetailsCase implements AccountDetailsRepository {
  async query(): Promise<AccountDetailsModel> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      address: {
        address1: "Rua da Glória",
        address2: "",
        city: "Rio de Janeiro",
        country: "BR",
        state: "RJ",
        zipCode: "012345",
      },
      contactConsent: true,
      email: "e.jones@email.com",
      informationConsent: true,
      name: "Jones",
      defaultPhone: "762-786-2364",
      surname: "Elliot",
    };
  }

  async mutate(data: AccountDetailsModel): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data
    return true;
  }
}
