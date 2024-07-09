import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";

import { Title } from "./Title";

const { getByRole, getByText } = screen;

describe("<Title />", () => {
  it.each(["A heading", "Another heading"])(
    `should render '%s'`,
    (expected) => {
      getRenderer({ children: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it(`should render H1 by default`, () => {
    getRenderer();
    expect(getByRole("heading").tagName).toBe("H1");
  });

  it.each(["H2", "H3", "H4", "H5", "H6"])(
    `should render a '%s' tag`,
    (expected) => {
      getRenderer({ level: expected.toLowerCase() as Props["level"] });
      expect(getByRole("heading").tagName).toBe(expected);
    }
  );
  });
});

// Helpers
type Props = ComponentProps<typeof Title>;
function getRenderer({
  children = "Sample Title",
  ...rest
}: Partial<Props> = {}) {
  return render(<Title {...rest}>{children}</Title>);
}
