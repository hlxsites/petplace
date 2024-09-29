import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { CartItemCard } from "./CartItemCard";

const { getByText } = screen;

const DEFAULT_QUANTITY = 5;

describe("CartItemCard", () => {
  it.each(["a name", "another name"])(
    "should render correct %s name",
    (expected) => {
      getRenderer({ name: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["a description", "another description"])(
    "should render correct %s description",
    (expected) => {
      getRenderer({ description: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["1.99", "11.90"])("should render correct %s price", (expected) => {
    getRenderer({ price: expected });
    expect(getByText(`$${expected}`)).toBeInTheDocument();
  });
});

function getRenderer({
  id = "test-id",
  description = "Test description",
  name = "Test name",
  price = "100.00",
  quantity = DEFAULT_QUANTITY,
  ...props
}: Partial<ComponentProps<typeof CartItemCard>> = {}) {
  return render(
    <CartItemCard
      id={id}
      description={description}
      name={name}
      price={price}
      quantity={quantity}
      {...props}
    />
  );
}
