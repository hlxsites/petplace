import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { MembershipCard } from "./MembershipCard";

const { getByRole, getByText, queryByText } = screen;

describe("MembershipCard", () => {
  it.each(["Lifetime", "Lifetime Plus", "Annual Protection"])(
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

  it.each(["99.99", "Free"])("should render the given price", (price) => {
    getRenderer({ price });
    expect(getByText(`$${price}`)).toBeInTheDocument();
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

  it("should render button with primary variant class when isHighlighted=true", () => {
    getRenderer({
      isHighlighted: true,
    });
    expect(getByRole("button", { name: "Test button label" })).toHaveClass(
      "bg-orange-300-contrast"
    );
  });

  it.each([false, undefined])(
    "should render the button with secondary variant class when isHighlighted=%s",
    (isHighlighted) => {
      getRenderer({
        isHighlighted,
      });
      expect(getByRole("button", { name: "Test button label" })).toHaveClass(
        "bg-white"
      );
    }
  );

  it("should render background card with specific class='bg-purple-100' to highlight the membership card when isHighlighted=true", () => {
    getRenderer({
      isHighlighted: true,
    });
    expect(getByRole("region")).toHaveClass("bg-purple-100");
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

  it("should render the given membership offer with clearCircle icon when isNotAvailableOnPlan is set to true", () => {
    getRenderer({
      membershipDescriptionOffers: [
        { offerLabel: "Amazing offer", isNotAvailableOnPlan: true },
      ],
    });
    expect(getByText("Amazing offer")).toBeInTheDocument();
    expect(
      document.querySelector("svg[data-file-name='SvgClearCircleIcon']")
    ).toBeInTheDocument();
  });

  it("should render text on membership offer with decoration when isNotAvailableOnPlan=true", () => {
    getRenderer({
      membershipDescriptionOffers: [
        {
          isNotAvailableOnPlan: true,
          offerLabel: "My custom offer",
        },
      ],
    });
    expect(getByText("My custom offer")).toHaveClass("line-through");
  });

  it.each([false, undefined])(
    "should NOT render text on membership offer with decoration when isNotAvailableOnPlan=false",
    (isNotAvailableOnPlan) => {
      getRenderer({
        membershipDescriptionOffers: [
          {
            isNotAvailableOnPlan,
            offerLabel: "Test custom offer",
          },
        ],
      });
      expect(getByText("Test custom offer")).not.toHaveClass("line-through");
    }
  );
});

function getRenderer({
  buttonLabel = "Test button label",
  id = "LPMMembership",
  price = "Test price",
  priceInfo = "Test info price label",
  subTitle = "Test info sub title",
  title = "Lifetime",
  type = "LPPM",
  ...props
}: Partial<ComponentProps<typeof MembershipCard>> = {}) {
  return render(
    <MemoryRouter>
      <MembershipCard
        buttonLabel={buttonLabel}
        id={id}
        price={price}
        priceInfo={priceInfo}
        subTitle={subTitle}
        title={title}
        type={type}
        {...props}
      />
    </MemoryRouter>
  );
}
