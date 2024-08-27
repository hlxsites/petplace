import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { CheckoutServices } from "~/mocks/MockRestApiServer";
import { CheckoutServicesDrawer } from "./CheckoutServicesDrawer";

const { getByRole, queryByRole, getByText } = screen;

const DEFAULT_SERVICES = [
  {
    name: "Test service 1",
    images: [],
  },
  {
    name: "Test service 2",
    images: [],
  },
];

describe("CheckoutServicesDrawer", () => {
  it("should render the Services title", () => {
    getRenderer();
    expect(getByRole("heading", { name: "Services" })).toBeInTheDocument();
  });

  it("should NOT render the Services title", () => {
    getRenderer({ isOpen: false });
    expect(
      queryByRole("heading", { name: "Services" })
    ).not.toBeInTheDocument();
  });

  it("should call onClose callbacks", async () => {
    const onClose = jest.fn();
    const { container } = getRenderer({ onClose });

    const closeButton = container.querySelector(
      "svg[data-file-name='SvgCloseXMarkIcon']"
    );
    if (closeButton) {
      await userEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it.each(DEFAULT_SERVICES.map(({ name }) => name))(
    "should render each services name: %s",
    (expected) => {
      getRenderer();
      expect(getByText(expected)).toBeInTheDocument();
    }
  );
});

function getRenderer({
  isOpen = true,
  onClose = jest.fn(),
  services = DEFAULT_SERVICES as unknown as CheckoutServices[],
}: Partial<ComponentProps<typeof CheckoutServicesDrawer>> = {}) {
  return render(
    <CheckoutServicesDrawer
      isOpen={isOpen}
      onClose={onClose}
      services={services}
    />
  );
}
