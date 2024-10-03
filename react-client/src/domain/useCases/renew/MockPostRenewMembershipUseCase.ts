import { PostRenewMembershipRepository } from "~/domain/repository/renew/PostRenewMembershipRepository";

export class MockPostRenewMembershipUseCase
  implements PostRenewMembershipRepository
{
  private cache = false;
  async post(): Promise<boolean> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.cache = !this.cache;
    return this.cache;
  }
}
