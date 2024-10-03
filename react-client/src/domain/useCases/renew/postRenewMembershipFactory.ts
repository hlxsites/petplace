import { HttpClientRepository } from "~/domain/repository/HttpClientRepository";
import { ENABLE_MOCK } from "~/util/envUtil";
import { PostRenewMembershipRepository } from "~/domain/repository/renew/PostRenewMembershipRepository";
import { PostRenewMembershipUseCase } from "./PostRenewMembershipUseCase";
import { MockPostRenewMembershipUseCase } from "./MockPostRenewMembershipUseCase";

export default function petListUseCaseFactory(
  authToken: string,
  httpClient?: HttpClientRepository
): PostRenewMembershipRepository {
  if (ENABLE_MOCK) return new MockPostRenewMembershipUseCase();

  return new PostRenewMembershipUseCase(authToken, httpClient);
}
