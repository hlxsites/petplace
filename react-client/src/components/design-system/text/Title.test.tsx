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

  it.each([
    ["H2", "h2"],
    ["H3", "h3"],
    ["H4", "h4"],
    ["H5", "h5"],
    ["H6", "h6"],
  ])(`should render a '%s' tag`, (expectedName, expectedTag) => {
    getRenderer({ level: expectedTag as Props["level"] });
    expect(getByRole("heading").tagName).toBe(expectedName);
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
