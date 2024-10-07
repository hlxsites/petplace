import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { AdvertisingBannerImageRight } from "./AdvertisingBannerImageRight";

const { getByRole, getByText, getByAltText, getAllByRole, queryByAltText } =
  screen;

describe("AdvertisingBannerImageRight", () => {
  it.each(["My custom title", "Insurance"])(
    "should render the given title",
    (title) => {
      getRenderer({ title: <h2>{title}</h2> });

      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["My message", "Another message"])(
    "should render the message with the expected text content",
    (message) => {
      getRenderer({ message });

      expect(getByText(message)).toBeInTheDocument();
    }
  );

  it.each(["A sub-message", "Another sub-message"])(
    "should render the sub-message with the expected text content",
    (subMessage) => {
      getRenderer({ subMessage });

      expect(getByText(subMessage)).toBeInTheDocument();
    }
  );

  it.each([
    ["https://my-image", "my custom image"],
    ["https://test", "test"],
  ])(
    "should render the image with the correct src and alt attributes",
    (img, name) => {
      getRenderer({ img, imgName: name });

      const imgElement = getByAltText(name);
      expect(imgElement).toHaveAttribute("src", img);
      expect(imgElement).toHaveAttribute("alt", name);
    }
  );

  it.each(["my button", "insurance button"])(
    "should render the button with the given label",
    (buttonLabel) => {
      getRenderer({ buttonLabel });

      const button = getAllByRole("button", { name: buttonLabel });
      expect(button[0]).toBeInTheDocument();
    }
  );

  it("should be able to pass the buttonProps", () => {
    getRenderer({ buttonProps: { id: "myCustomButton" } });

    expect(getAllByRole("button")[0]).toHaveAttribute("id", "myCustomButton");
  });

  it("should be able to pass the card props", () => {
    getRenderer({ cardStyleProps: { backgroundColor: "bg-orange-100" } });

    expect(getByRole("region")).toHaveClass("bg-orange-100");
  });

  it.each(["from-blue-100", "from-purple-500"] as ComponentProps<
    typeof AdvertisingBannerImageRight
  >["gradientColor"][])(
    "should apply gradient color classes based on props",
    (gradientColor) => {
      const { container } = getRenderer({ gradientColor });
      const gradientDiv = container.querySelector(
        ".absolute.inset-0.bg-gradient-to-b"
      );
      expect(gradientDiv).toHaveClass(`${gradientColor}`);
    }
  );

  it.each([
    ["right", "lg:bg-gradient-to-r"],
    ["top", "lg:bg-gradient-to-t"],
    ["bottom", "lg:bg-gradient-to-b"],
    ["left", "lg:bg-gradient-to-l"],
  ])(
    "should apply gradient direction classes based on props",
    (gradientDirection, expected) => {
      // @ts-expect-error - ignoring for test purposes only
      getRenderer({ gradientColor: "from-blue-100", gradientDirection });
      expect(getByAltText("insurance").nextSibling).toHaveClass(expected);
    }
  );

  it("should NOT render img tag when no img src and name is provided", () => {
    getRenderer({ img: "", imgName: "" });
    expect(queryByAltText("insurance")).not.toBeInTheDocument();
  });

  it("should render img tag with only alt attribute when src is not provided", () => {
    getRenderer({ img: "", imgName: "Alternative text" });
    expect(getByAltText("Alternative text")).toHaveAttribute(
      "alt",
      "Alternative text"
    );
    expect(getByAltText("Alternative text")).toHaveAttribute("src", "");
  });

  it("should NOT render the gradient div when no img src is provided", () => {
    const { container } = getRenderer({ img: "", imgName: "My cat image" });

    const gradientDiv = container.querySelector(
      ".absolute.inset-0.bg-gradient-to-b.to-transparent"
    );
    expect(gradientDiv).not.toBeInTheDocument();
  });
});

function getRenderer({
  cardStyleProps,
  img = "http://image",
  imgName = "insurance",
  title = <span>Hello World</span>,
  ...props
}: Partial<ComponentProps<typeof AdvertisingBannerImageRight>> = {}) {
  return render(
    <MemoryRouter>
      <AdvertisingBannerImageRight
        cardStyleProps={cardStyleProps}
        imgName={imgName}
        img={img}
        title={title}
        {...props}
      />
    </MemoryRouter>
  );
}
