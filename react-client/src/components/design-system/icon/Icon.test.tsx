import { render } from "@testing-library/react";
import { ComponentProps } from "react";

import { upperCaseFirstLetter } from "~/util/stringUtil";
import { Icon, IconKeys, IconMap } from "./Icon";

describe("<Icon />", () => {
  it.each(Object.keys(IconMap))("should render the icon %p", (expected) => {
    getRenderer({ display: expected as IconKeys });
    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      `Svg${upperCaseFirstLetter(expected)}Icon`
    );
  });

  it.each(["a-class", "another-class"])(
    "should render an icon with custom class %p",
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
