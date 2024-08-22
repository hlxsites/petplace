import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { CartItemCard } from "./CartItemCard";

const { getByText, queryByText } = screen;

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
    expect(getByText(expected)).toBeInTheDocument();
  });

  it.each([
    ["an acquisition message", "a recurrence"],
    ["another acquisition message", "another recurrence"],
  ])(
    "should render correct %s and %s when type is service",
    (acquisitionMessage, recurrence) => {
      getRenderer({ acquisitionMessage, recurrence, type: "service" });
      expect(getByText(acquisitionMessage)).toBeInTheDocument();
      expect(getByText(recurrence)).toBeInTheDocument();
    }
  );

  it("should NOT render acquisitionMessage and recurrence when type is product", () => {
    const acquisitionMessage = "acquisitionMessage";
    const recurrence = "recurrence";
    getRenderer({ acquisitionMessage, recurrence, type: "product" });
    expect(queryByText(acquisitionMessage)).not.toBeInTheDocument();
    expect(queryByText(recurrence)).not.toBeInTheDocument();
  });

  it("should render quantity manager when type is product", () => {
    getRenderer({ type: "product" });

    expect(
      document.querySelector("svg[data-file-name='SvgRemoveCircleIcon']")
    ).toBeInTheDocument();
  });

  it("should NOT render quantity manager when type is service", () => {
    getRenderer({ type: "service" });
    expect(
      document.querySelector("svg[data-file-name='SvgRemoveCircleIcon']")
    ).not.toBeInTheDocument();
  });
});

function getRenderer({
  id = "test-id",
  description = "Test description",
  name = "Test name",
  price = "100.00",
  type = "product",
  quantity = DEFAULT_QUANTITY,
  onUpdateQuantity = jest.fn(),
  ...props
}: Partial<ComponentProps<typeof CartItemCard>> = {}) {
  return render(
    <CartItemCard
      id={id}
      description={description}
      name={name}
      price={price}
      type={type}
      quantity={quantity}
      onUpdateQuantity={onUpdateQuantity}
      {...props}
    />
  );
}
