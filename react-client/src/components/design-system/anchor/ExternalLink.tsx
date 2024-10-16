import { ReactNode, forwardRef } from "react";

type ExternalLinkProps = {
  className?: string;
  children: ReactNode;
  href: string;
  id?: string;
};

const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ children, ...rest }, ref) => {
    return (
      <a ref={ref} rel="noopener noreferrer" target="__blank" {...rest}>
        {children}
      </a>
    );
  }
);

export default ExternalLink;
