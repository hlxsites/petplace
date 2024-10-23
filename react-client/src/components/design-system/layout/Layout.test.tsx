import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { Layout } from "./Layout";

const { getByText } = screen;

describe("Layout", () => {
  it("should render the correct class", () => {
    const { container } = getRenderer();
    expect(container.firstChild).toHaveClass("md:px-base");
  });

  it("should render the given children", () => {
    const childrenText = "My given children";
    getRenderer({ children: <div>{childrenText}</div> });

    expect(getByText(childrenText)).toBeInTheDocument();
  });
});

function getRenderer({
  children = <div>Test</div>,
}: Partial<ComponentProps<typeof Layout>> = {}) {
  return render(<Layout>{children}</Layout>);
}
