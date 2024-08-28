import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { CheckoutServiceCard } from "./CheckoutServiceCard";

const { getByText, queryByText, queryByRole, getByRole } = screen;

describe("CheckoutServiceCard", () => {
  it.each(["A name", "Another name"])(
    "should render service name",
    (expected) => {
      getRenderer({ name: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["A price", "Another price"])(
    "should render service price",
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
    expect(getByText("/year")).toBeInTheDocument();
  });

  it("should render service annual label", () => {
    getRenderer({ isAnnual: false });
    expect(queryByText("/year")).not.toBeInTheDocument();
  });

  it("should render service image", () => {
    getRenderer({ images: [{ src: "some-src" }] });
    expect(getByRole("img")).toBeInTheDocument();
  });

  it("should NOT render service image", () => {
    getRenderer({ images: [] });
    expect(queryByRole("img")).not.toBeInTheDocument();
  });
});

function getRenderer({
  id = "Test id",
  name = "Test name",
  price = "$100",
  isAnnual = true,
  images = [],
  description = "Test description",
}: Partial<ComponentProps<typeof CheckoutServiceCard>> = {}) {
  return render(
    <CheckoutServiceCard
      id={id}
      name={name}
      price={price}
      isAnnual={isAnnual}
      description={description}
      images={images}
    />
  );
}
