import { PostRenewMembershipRepository } from "~/domain/repository/renew/PostRenewMembershipRepository";
import { RenewMembershipModel } from "~/domain/models/renew/RenewMembershipModel";

export class MockPostRenewMembershipUseCase
  implements PostRenewMembershipRepository
{
  async post(data: RenewMembershipModel): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data;
    return true;
  }
}
