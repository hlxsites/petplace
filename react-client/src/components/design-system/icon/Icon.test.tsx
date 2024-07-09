import { render } from "@testing-library/react";
import { ComponentProps } from "react";

import { Icon } from "./Icon";

describe("<Icon />", () => {
  it.each(["add", "check"])(`should render an icon '%s'`, (expected) => {
    const { container } = getRenderer({
      display: expected as Props["display"],
    });
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it.each(["a-class", "another-class"])(
    `should render an icon '%s'`,
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
