import { render, screen } from "@testing-library/react";
import { ButtonWithBadge } from "./ButtonWithBadge";
import { ComponentProps } from "react";

const { getByRole, queryByRole } = screen;

describe("ButtonWithBadge", () => {
  it.each([3, 5, 100])("should render the given badge", (badge) => {
    getRenderer({ badge });
    expect(getByRole("status")).toHaveTextContent(`${badge}`);
  });

  it.each([90, 600])(
    "should render the badge with aria-label in plural",
    (badge) => {
      getRenderer({ badge });
      expect(getByRole("status")).toHaveAttribute(
        "aria-label",
        `${badge} items`
      );
    }
  );

  it("should render the badge with aria-label in singular", () => {
    getRenderer({ badge: 1 });
    expect(getByRole("status")).toHaveAttribute("aria-label", "1 item");
  });

  it.each([0, -3, -99])(
    "should NOT render the badge when the provided value is equals or less than zero",
    (badge) => {
      getRenderer({ badge });
      expect(queryByRole("status")).not.toBeInTheDocument();
    }
  );

  it("should render button with classes of variant='secondary' by default", () => {
    getRenderer();
    expect(queryByRole("button")).toHaveClass(
      "bg-white border-neutral-700 text-neutral-700"
    );
  });
});

function getRenderer({
  badge = 400,
  ...props
}: Partial<ComponentProps<typeof ButtonWithBadge>> = {}) {
  return render(<ButtonWithBadge badge={badge} {...props} />);
}
