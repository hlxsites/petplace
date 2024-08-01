import { render, screen, waitFor } from "@testing-library/react";
import { ComponentProps } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "./Header";

const { getByRole, getByLabelText, queryByLabelText, getByText } = screen;

describe("Header", () => {
  it("should render the given page title", () => {
    const pageTitle = "Pet Profile";
    getRenderer({ pageTitle });

    expect(getByRole("heading")).toHaveTextContent(pageTitle);
  });

  it("should render the primaryElement when it is given", () => {
    const primaryElementLabel = "Primary Element";
    getRenderer({ primaryElement: <div>{primaryElementLabel}</div> });

    expect(getByText(primaryElementLabel)).toBeInTheDocument();
  });

  it("should render the secondaryElement when it is given ", () => {
    const secondaryElementLabel = "Primary Element";
    getRenderer({ secondaryElement: <div>{secondaryElementLabel}</div> });

    expect(getByText(secondaryElementLabel)).toBeInTheDocument();
  });

  it.each([false, undefined])(
    "should NOT render back link icon when shouldRenderBackButton is set to %p",
    (shouldRenderBackButton) => {
      getRenderer({ shouldRenderBackButton });

      expect(queryByLabelText("Back button")).not.toBeInTheDocument();
    }
  );

  it("should render link icon button as chevron-left by default when shouldRenderBackButton is set to true", async () => {
    getRenderer({ shouldRenderBackButton: true });

    await waitFor(() => {
      expect(getByLabelText("Back button")).toBeInTheDocument();
      expect(document.querySelector("svg")).toHaveAttribute(
        "data-file-name",
        "SvgChevronLeftIcon"
      );
    });
  });

  it("should pass props to linkIconButton when shouldRenderBackButton is set to true", async () => {
    getRenderer({
      linkIconButtonProps: {
        buttonProps: {
          label: "Check icon",
          icon: "check",
        },
        to: "/test",
      },
      shouldRenderBackButton: true,
    });

    await waitFor(() => {
      expect(getByLabelText("Check icon")).toBeInTheDocument();
      expect(document.querySelector("svg")).toHaveAttribute(
        "data-file-name",
        "SvgCheckIcon"
      );
      expect(getByRole("link")).toHaveAttribute("href", "/test");
    });
  });

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();

    expect(container).toMatchSnapshot();
  });
});

function getRenderer({
  linkIconButtonProps,
  pageTitle = "Test Title",
  primaryElement = <div>Primary</div>,
  secondaryElement = <div>Secondary</div>,
  shouldRenderBackButton,
}: Partial<ComponentProps<typeof Header>> = {}) {
  return render(
    <Router>
      <Header
        linkIconButtonProps={linkIconButtonProps}
        pageTitle={pageTitle}
        primaryElement={primaryElement}
        secondaryElement={secondaryElement}
        shouldRenderBackButton={shouldRenderBackButton}
      />
    </Router>
  );
}
