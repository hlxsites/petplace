import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { CheckoutServiceCard } from "./CheckoutServiceCard";

const { getAllByRole, getByText, queryByText, queryByRole, getByRole } = screen;

describe("CheckoutServiceCard", () => {
  it.each(["A name", "Another name"])(
    "should render service name %p",
    (expected) => {
      getRenderer({ title: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["$24.95", "$15.00"])(
    "should render service price %p",
    (expected) => {
      getRenderer({ price: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["A description", "Another description"])(
    "should render service description",
    (expected) => {
      getRenderer({ description: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render service annual label", () => {
    getRenderer({ isAnnual: true });
    expect(getByText("$100/year")).toBeInTheDocument();
  });

  it("should not render service annual label", () => {
    getRenderer({ isAnnual: false });
    expect(queryByText("$100/year")).not.toBeInTheDocument();
  });

  it("should render service image", () => {
    getRenderer({ images: ["some-src"] });
    expect(getByRole("img")).toBeInTheDocument();
  });

  it("should render all service images", () => {
    getRenderer({ images: ["some-src", "another-src"] });
    expect(getAllByRole("img")).toHaveLength(2);
  });

  it("should NOT render service image", () => {
    getRenderer({ images: [] });
    expect(queryByRole("img")).not.toBeInTheDocument();
  });
});

function getRenderer({
  id = "Test id",
  title = "Test title",
  price = "$100",
  isAnnual = false,
  images = [],
  description = "Test description",
}: Partial<ComponentProps<typeof CheckoutServiceCard>> = {}) {
  return render(
    <CheckoutServiceCard
      id={id}
      title={title}
      price={price}
      isAnnual={isAnnual}
      description={description}
      images={images}
    />
  );
}
