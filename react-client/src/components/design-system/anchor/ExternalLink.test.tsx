import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";

import ExternalLink from "./ExternalLink";

const { getByRole } = screen;

describe("<ExternalLink />", () => {
  it.each(["Children", "Another children"])(
    "should render children %p",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByRole("link", { name: expected })).toBeInTheDocument();
    }
  );

  it.each(["https://a-link.com", "http://another-link.com"])(
    "should have href=%p",
    (expected) => {
      getRenderer({ href: expected });
      expect(getByRole("link")).toHaveAttribute("href", expected);
    }
  );

  it('should have target="__blank"', () => {
    getRenderer();
    expect(getByRole("link")).toHaveAttribute("target", "__blank");
  });

  it('should have rel="noopener noreferrer"', () => {
    getRenderer();
    expect(getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each(["a-class", "another-class"])("should have class %p", (expected) => {
    getRenderer({ className: expected });
    expect(getByRole("link")).toHaveClass(expected);
  });
});

// Helpers
type TestProps = ComponentProps<typeof ExternalLink>;

function getRenderer({
  children = "The link",
  href = "pricing",
  ...rest
}: Partial<TestProps> = {}) {
  return render(
    <ExternalLink href={href} {...rest}>
      {children}
    </ExternalLink>
  );
}
