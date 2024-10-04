import { LinkButton } from "../design-system";
import { useMembershipProductsLink } from "./hooks/useMembershipProductsLink";

type MembershipComparingPlanLinkButtonProps = {
  id: string;
  isHighlighted?: boolean;
  label: string;
};

export const MembershipComparingPlanLinkButton = ({
  id,
  isHighlighted,
  label,
}: MembershipComparingPlanLinkButtonProps) => {
  const to = useMembershipProductsLink(id);

  return (
    <LinkButton to={to} variant={isHighlighted ? "primary" : "secondary"}>
      {label}
    </LinkButton>
  );
};
