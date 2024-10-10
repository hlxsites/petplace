import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { CartItemCard } from "./CartItemCard";

const { getByText } = screen;

const DEFAULT_QUANTITY = 5;

describe("CartItemCard", () => {
  it.each(["a name", "another name"])(
    "should render correct %s name",
    (expected) => {
      getRenderer({ title: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["a description", "another description"])(
    "should render correct %s subTitle",
    (expected) => {
      getRenderer({ subTitle: expected });
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
  subTitle = "Test description",
  onUpdateQuantity = jest.fn(),
  quantity = DEFAULT_QUANTITY,
  price = "100.00",
  title = "Test name",
  ...props
}: Partial<ComponentProps<typeof CartItemCard>> = {}) {
  return render(
    <MemoryRouter>
      <CartItemCard
        id={id}
        subTitle={subTitle}
        onUpdateQuantity={onUpdateQuantity}
        quantity={quantity}
        price={price}
        title={title}
        {...props}
      />
    </MemoryRouter>
  );
}
