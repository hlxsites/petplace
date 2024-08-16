import { render, screen } from "@testing-library/react";
import { MembershipCard } from "./MembershipCard";
import { ComponentProps } from "react";

const { getByRole, getByText, queryByText } = screen;

describe("MembershipCard", () => {
  it.each(["My title", "Awesome title"])(
    "should render the given title",
    (title) => {
      getRenderer({ title });
      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["My sub title", "Awesome sub title"])(
    "should render the given sub title",
    (subTitle) => {
      getRenderer({ subTitle });
      expect(getByText(subTitle)).toBeInTheDocument();
    }
  );

  it.each(["$99.99", "Free"])("should render the given price", (price) => {
    getRenderer({ price });
    expect(getByText(price)).toBeInTheDocument();
  });

  it.each(["One-time fee", "First time fee"])(
    "should render the given price info",
    (priceInfo) => {
      getRenderer({ priceInfo });
      expect(getByText(priceInfo)).toBeInTheDocument();
    }
  );

  it.each(["Get best offer", "Get 1 year protection"])(
    "should render the given button label",
    (buttonLabel) => {
      getRenderer({ buttonLabel });
      expect(getByRole("button", { name: buttonLabel })).toBeInTheDocument();
    }
  );

  it("should render button with primary variant class when cardProps is provided", () => {
    getRenderer({
      cardProps: {
        backgroundColor: "bg-black",
      },
    });
    expect(getByRole("button", { name: "Test button label" })).toHaveClass(
      "bg-orange-300-contrast"
    );
  });

  it("should render the button with secondary variant class when no cardProps is provided", () => {
    getRenderer();
    expect(getByRole("button", { name: "Test button label" })).toHaveClass(
      "bg-white"
    );
  });

  it("should pass the given card props for style purpose", () => {
    getRenderer({
      cardProps: {
        backgroundColor: "bg-black",
      },
    });
    expect(getByRole("region")).toHaveClass("bg-black");
  });

  it.each(["footer information", "awesome information"])(
    "should render the given footer information",
    (infoFooter) => {
      getRenderer({ infoFooter });
      expect(getByText(infoFooter)).toBeInTheDocument();
    }
  );

  it("should NOT render footer information when it's not provided", () => {
    getRenderer();
    expect(queryByText("footer information")).not.toBeInTheDocument();
  });

  it("should render the given membership offer with checkCircle icon by default", () => {
    getRenderer({
      membershipDescriptionOffers: [{ offerLabel: "Amazing offer" }],
    });
    expect(getByText("Amazing offer")).toBeInTheDocument();
    expect(
      document.querySelector("svg[data-file-name='SvgCheckCircleIcon']")
    ).toBeInTheDocument();
  });

  it("should render the given membership offer with it's own icon when provided", () => {
    getRenderer({
      membershipDescriptionOffers: [
        {
          icon: "add",
          offerLabel: "Another amazing offer",
        },
      ],
    });
    expect(getByText("Another amazing offer")).toBeInTheDocument();
    expect(
      document.querySelector("svg[data-file-name='SvgAddIcon']")
    ).toBeInTheDocument();
  });

  it("should render text on membership offer with decoration when icon is provided", () => {
    getRenderer({
      membershipDescriptionOffers: [
        {
          icon: "cpuChip",
          offerLabel: "My custom offer",
        },
      ],
    });
    expect(getByText("My custom offer")).toHaveClass("line-through");
  });

  it("should NOT render text on membership offer with decoration when no icon is provided", () => {
    getRenderer({
      membershipDescriptionOffers: [
        {
          offerLabel: "Test custom offer",
        },
      ],
    });
    expect(getByText("Test custom offer")).not.toHaveClass("line-through");
  });
});

function getRenderer({
  buttonLabel = "Test button label",
  price = "Test price",
  priceInfo = "Test info price label",
  subTitle = "Test info sub title",
  title = "Test title",
  ...props
}: Partial<ComponentProps<typeof MembershipCard>> = {}) {
  return render(
    <MembershipCard
      buttonLabel={buttonLabel}
      price={price}
      priceInfo={priceInfo}
      subTitle={subTitle}
      title={title}
      {...props}
    />
  );
}
