import { render } from "@testing-library/react";
import { ComponentProps } from "react";

import { Icon } from "./Icon";

describe("<Icon />", () => {
  it.each(["Add", "Check"])(`should render an icon '%s'`, (expected) => {
    const { container } = getRenderer({
      display: expected.toLowerCase() as Props["display"],
    });
    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute(
      "data-file-name",
      `Svg${expected}Icon`
    );
  });

  it.each(["a-class", "another-class"])(
    `should render an icon with custom class'%s'`,
    (expected) => {
      const { container } = getRenderer({
        className: expected,
      });
      expect(container.querySelector("svg")?.parentElement).toHaveClass(
        expected
      );
    }
  );
});

// Helpers
type Props = ComponentProps<typeof Icon>;
function getRenderer({ display = "add", ...rest }: Partial<Props> = {}) {
  return render(<Icon display={display} {...rest} />);
}
