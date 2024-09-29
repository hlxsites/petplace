import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CartDrawer } from "./CartDrawer";

const { getByLabelText, getAllByRole, getByText } = screen;

const DEFAULT_ITEMS = [
  { id: "1", name: "byteTag", price: "$99.00" },
  { id: "2", name: "plan", price: "$19.00" },
];

// TODO: Mock view model
describe.skip("CartDrawer", () => {
  it("should render", () => {
    getRenderer();
    expect(getByLabelText("Cart Drawer")).toBeInTheDocument();
  });

  it("should render text Items", () => {
    getRenderer();
    expect(getByText("Items")).toBeInTheDocument();
  });

  it("should render 2 items", () => {
    getRenderer();
    expect(getAllByRole("listitem").length).toBe(DEFAULT_ITEMS.length);
  });
});

function getRenderer() {
  return render(<CartDrawer />);
}
