import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { LinkIconButton } from "./LinkIconButton";

const { getByRole } = screen;

describe("LinkIconButton", () => {
  it("should pass linkProps to Link component", () => {
    const target = "_blank";
    const to = "/my-pets";

    getRenderer({
      target,
      to,
    });

    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute("href", to);
    expect(linkElement).toHaveAttribute("target", target);
  });

  it.each(["A label", "Another label"])("should have label %p", (label) => {
    getRenderer({ label });

    expect(getByRole("link", { name: label })).toBeInTheDocument();
  });

  it("should pass buttonProps to IconButton component", () => {
    getRenderer({
      buttonProps: {
        icon: "shieldOff",
      },
    });

    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgShieldOffIcon"
    );
  });

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();

    expect(container).toMatchSnapshot();
  });
});

function getRenderer({
  buttonProps = {
    icon: "check",
  },
  label = "Check button",
  to = "/test",
  ...rest
}: Partial<ComponentProps<typeof LinkIconButton>> = {}) {
  return render(
    <Router>
      <LinkIconButton
        buttonProps={buttonProps}
        label={label}
        to={to}
        {...rest}
      />
    </Router>
  );
}
