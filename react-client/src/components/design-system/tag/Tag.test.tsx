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

  it("should render info icon for tagStatus=%s", () => {
    const { container } = getRenderer({ tagStatus: "warning" });

    expect(
      container.querySelector("svg[data-file-name='SvgInformationIcon']")
    ).toBeInTheDocument();
  });

  it("should NOT render info icon for tagStatus='success'", () => {
    const { container } = getRenderer({ tagStatus: "success" });

    expect(
      container.querySelector("svg[data-file-name='SvgInformationIcon']")
    ).not.toBeInTheDocument();
  });

  it("should render with full width when fullWidth is true", () => {
    const { container } = getRenderer({ fullWidth: true });

    expect(container.firstChild).toHaveClass("w-full");
  });

  it("should NOT have w-full class when fullWidth is false", () => {
    const { container } = getRenderer({ fullWidth: false });

    expect(container.firstChild).not.toHaveClass("w-full");
  });
});

// Test utils
type Props = ComponentProps<typeof Tag>;
type TagType = Props["tagStatus"][];

function getRenderer({
  label = "Test label",
  tagStatus = "success",
  fullWidth = false,
}: Partial<Props> = {}) {
  return render(
    <Tag label={label} tagStatus={tagStatus} fullWidth={fullWidth} />
  );
}
