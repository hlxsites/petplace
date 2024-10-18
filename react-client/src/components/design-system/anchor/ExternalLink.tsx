import { ReactNode, forwardRef } from "react";

type ExternalLinkProps = {
  className?: string;
  children: ReactNode;
  href: string;
  id?: string;
  openInNewTab?: boolean;
};

const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ children, openInNewTab = true, ...rest }, ref) => {
    return (
      <a
        ref={ref}
        rel="noopener noreferrer"
        target={openInNewTab ? "_blank" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
);

export default ExternalLink;
