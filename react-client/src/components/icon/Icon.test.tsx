import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";

import type { IconKeys} from "./Icon";
import { Icon, IconMap } from "./Icon";

describe("<Icon />", () => {
  it.each(Object.keys(IconMap))("should display icon '%s'", (expected) => {
    getRenderer({ display: expected as IconKeys });
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it.each(["custom-class", "camelCaseClass"])(
    "should use className '%s'",
    (expected) => {
      getRenderer({ className: expected, display: "checkS" });
      expect(document.querySelector("svg")).toHaveClass(expected);
    }
  );

  it("should spin", () => {
    getRenderer({ display: "checkS", spin: true });
    expect(document.querySelector("svg")).toHaveClass("fa-spin");
  });

  it("should NOT spin", () => {
    getRenderer({ display: "checkS", spin: false });
    expect(document.querySelector("svg")).not.toHaveClass("fa-spin");
  });

  it("should have fixed width", () => {
    getRenderer({ display: "checkS", fixedWidth: true });
    expect(document.querySelector("svg")).toHaveClass("fa-fw");
  });

  it.each(["TestId, AnotherTestId"])("should have data-testid", (expected) => {
    getRenderer({ "data-testid": expected, display: "checkS" });
    expect(screen.getByTestId(expected)).toBeInTheDocument();
  });

  it("should NOT have aria-hidden=true by default", () => {
    getRenderer({
      "data-testid": "TheIcon",
      display: "checkS",
    });
    expect(screen.getByTestId("TheIcon")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("should have aria-hidden=true", () => {
    getRenderer({
      "aria-hidden": true,
      "data-testid": "TheIcon",
      display: "checkS",
    });
    expect(screen.getByTestId("TheIcon")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("should have aria-hidden=false", () => {
    getRenderer({
      "aria-hidden": false,
      "data-testid": "TheIcon",
      display: "checkS",
    });
    expect(screen.getByTestId("TheIcon")).toHaveAttribute(
      "aria-hidden",
      "false"
    );
  });
});

function getRenderer({ spin = false, ...rest }: ComponentProps<typeof Icon>) {
  return render(<Icon spin={spin} {...rest} />);
}
