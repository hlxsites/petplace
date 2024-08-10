import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { Tag } from "./Tag";

const { getByText } = screen;

describe("Tag", () => {
  it.each(["Awesome test", "Great time coding"])(
    "should render the given text",
    (label) => {
      getRenderer({ label });

      expect(getByText(label)).toBeInTheDocument();
    }
  );

  it.each(["success", "warning", "info"] satisfies TagType)(
    "should always render component with ellipse icon",
    (tagStatus) => {
      const { container } = getRenderer({ tagStatus });
      expect(container.querySelector("svg[name='SvgEllipseIcon']"))
        .toBeInTheDocument;
    }
  );

  it.each([
    ["info", "text-blue-500"],
    ["success", "text-green-500"],
    ["warning", "text-yellow-500"],
  ])(
    "should render the text tags with expected classes",
    (tagStatus, expected) => {
      // @ts-expect-error - ignoring type error for testing purposes
      getRenderer({ tagStatus });

      expect(getByText("Test label")).toHaveClass(expected);
    }
  );

  it.each(["info", "warning"] satisfies TagType)(
    "should render info icon for tagStatus=%s",
    (tagStatus) => {
      const { container } = getRenderer({ tagStatus });

      expect(
        container.querySelector("svg[data-file-name='SvgInformationIcon']")
      ).toBeInTheDocument();
    }
  );

  it("should NOT render info icon for tagStatus='success'", () => {
    const { container } = getRenderer({ tagStatus: "success" });

    expect(
      container.querySelector("svg[data-file-name='SvgInformationIcon']")
    ).not.toBeInTheDocument();
  });
});

// Test utils
type Props = ComponentProps<typeof Tag>;
type TagType = Props["tagStatus"][];

function getRenderer({
  label = "Test label",
  tagStatus = "success",
}: Partial<Props> = {}) {
  return render(<Tag label={label} tagStatus={tagStatus} />);
}
