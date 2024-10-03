import { RenewMembershipModel } from "~/domain/models/renew/RenewMembershipModel";

export interface PostRenewMembershipRepository {
  post(data: RenewMembershipModel): Promise<boolean>;
}
