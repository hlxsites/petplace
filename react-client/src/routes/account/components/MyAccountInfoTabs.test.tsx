import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { MyAccountInfoTabs } from "./MyAccountInfoTabs";

const { getByText, queryByText } = screen;

describe("MyAccountInfoTabs", () => {
  it.each(["Account details", "Notifications", "Payment information"])(
    "should render component with all expected Tabs when is an external login",
    (tabTitle) => {
      getRenderer({ isExternalLogin: true });

      expect(getByText(tabTitle)).toBeInTheDocument();
    }
  );

  it("should NOT render component with Tab 'Payment information' when is not an external login", () => {
    getRenderer({ isExternalLogin: false });

    expect(queryByText(/Payment information/i)).not.toBeInTheDocument();
  });
});

function getRenderer({
  ...props
}: Partial<ComponentProps<typeof MyAccountInfoTabs>> = {}) {
  return render(
    <MemoryRouter initialEntries={["/account"]}>
      <MyAccountInfoTabs {...props} />
    </MemoryRouter>
  );
}
