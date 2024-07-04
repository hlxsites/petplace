import { render, screen } from "@testing-library/react";
import { LinkIconButton } from "./LinkIconButton";
import { ComponentProps } from "react";
import { BrowserRouter as Router } from "react-router-dom";

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

  it("should pass buttonProps to IconButton component", () => {
    const label = "Shield off";

    getRenderer({
      buttonProps: {
        icon: "shieldOff",
        label,
      },
    });

    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgShieldOffIcon"
    );
    expect(getByRole("button")).toHaveAttribute("aria-label", label);
  });
});

function getRenderer({
  buttonProps = {
    icon: "check",
    label: "Check button",
  },
  to = "/test",
  ...rest
}: Partial<ComponentProps<typeof LinkIconButton>> = {}) {
  return render(
    <Router>
      <LinkIconButton buttonProps={buttonProps} to={to} {...rest} />
    </Router>
  );
}
