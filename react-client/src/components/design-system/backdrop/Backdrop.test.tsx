import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { Backdrop } from "./Backdrop";

const { getByTestId, queryByTestId, getByText } = screen;

describe("<Backdrop />", () => {
  it("should render the backdrop", () => {
    getRenderer();
    expect(getByTestId("backdrop")).toBeInTheDocument();
  });

  it("should render the backdrop with initial animation classes", () => {
    getRenderer();
    expect(getByTestId("backdrop-blur")).toHaveClass("fixed inset-0 h-screen w-screen backdrop-blur-sm animate-fadeIn bg-black/30");
  });

  it("should not render the backdrop", () => {
    getRenderer({ isOn: false });
    expect(queryByTestId("backdrop")).not.toBeInTheDocument();
  });

  it.each(["Sample children", "Another children"])(
    "should render backdrop's with children %s",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should call turnOff callback when clicked on it", async () => {
    const turnOff = jest.fn();

    getRenderer({ turnOff });
    expect(turnOff).not.toHaveBeenCalled();

    await userEvent.click(getByTestId("backdrop"));
    await userEvent.click(getByTestId("backdrop"));
    expect(turnOff).toHaveBeenCalledTimes(2);
  });

  it("should be rendered as a direct children of the document's body element", () => {
    const divId = "divId";
    render(
      <div data-testid={divId}>
        <Backdrop isOn={true}></Backdrop>
      </div>
    );

    expect(getByTestId(divId)).toBeInTheDocument();
    expect(getByTestId("backdrop").parentElement?.tagName).toBe("BODY");
  });

  it("should stop rendering backdrop with a animation delay", async () => {
    const backdropEnvironment = (isOn: boolean) => (<Backdrop isOn={isOn}>Test children</Backdrop>);

    const { rerender } = render(backdropEnvironment(true));
    const backdrop = queryByTestId("backdrop")
    const backdropBlur = queryByTestId("backdrop-blur")
    rerender(backdropEnvironment(false));

    expect(backdrop).toBeInTheDocument();
    expect(backdropBlur).toHaveClass("animate-fadeOut");
    await waitFor(() => {
      expect(backdrop).not.toBeInTheDocument();
    });
  });
});

// Helpers
type Props = ComponentProps<typeof Backdrop>;
function getRenderer({
  children = <p>Children text</p>,
  isOn = true,
  ...rest
}: Partial<Props> = {}) {
  return render(
    <Backdrop {...rest} isOn={isOn}>
      {children}
    </Backdrop>
  );
}
