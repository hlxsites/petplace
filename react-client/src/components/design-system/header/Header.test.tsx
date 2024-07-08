import { render, screen, waitFor } from "@testing-library/react";
import { ComponentProps } from "react";
import { Header } from "./Header";
import { BrowserRouter as Router } from "react-router-dom";

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
    "should NOT render back link icon when shouldRenderBackButton is set to %s",
    (shouldRenderBackButton) => {
      getRenderer({ shouldRenderBackButton });

      expect(queryByLabelText("Back button")).not.toBeInTheDocument();
    }
  );

  it("should render back link icon when shouldRenderBackButton is set to true", async () => {
    getRenderer({ shouldRenderBackButton: true });

    await waitFor(() => {
      expect(getByLabelText("Back button")).toBeInTheDocument();
    });
  });

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();

    expect(container).toMatchSnapshot();
  });
});

function getRenderer({
  pageTitle = "Test Title",
  primaryElement = <div>Primary</div>,
  secondaryElement = <div>Secondary</div>,
  shouldRenderBackButton,
}: Partial<ComponentProps<typeof Header>> = {}) {
  return render(
    <Router>
      <Header
        pageTitle={pageTitle}
        primaryElement={primaryElement}
        secondaryElement={secondaryElement}
        shouldRenderBackButton={shouldRenderBackButton}
      />
    </Router>
  );
}
