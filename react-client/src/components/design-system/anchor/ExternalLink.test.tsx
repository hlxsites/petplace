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

  it('should have rel="noopener noreferrer"', () => {
    getRenderer();
    expect(getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each(["a-class", "another-class"])("should have class %p", (expected) => {
    getRenderer({ className: expected });
    expect(getByRole("link")).toHaveClass(expected);
  });

  it.each(["id1", "id2"])("should have id %p", (expected) => {
    getRenderer({ id: expected });
    expect(getByRole("link")).toHaveAttribute("id", expected);
  });

  it("should open in a new tab by default", () => {
    getRenderer();
    expect(getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("should not open in a new tab when openInNewTab is false", () => {
    getRenderer({ openInNewTab: false });
    expect(getByRole("link")).not.toHaveAttribute("target", "_blank");
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
