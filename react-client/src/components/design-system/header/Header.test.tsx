import { render, screen, waitFor } from "@testing-library/react";
import { ComponentProps } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "./Header";

const { getByRole, queryByRole, getByText } = screen;

const BACK_BUTTON_LABEL = /back to previous page/i;

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

  it("should NOT render back link icon when backButtonTo is not provided", () => {
    getRenderer({ backButtonTo: undefined });
    expect(
      queryByRole("link", { name: BACK_BUTTON_LABEL })
    ).not.toBeInTheDocument();
  });

  it("should render link icon button as chevron-left by default when backButtonTo is provided", async () => {
    getRenderer({ backButtonTo: "/whathever" });

    await waitFor(() => {
      expect(
        getByRole("link", { name: BACK_BUTTON_LABEL })
      ).toBeInTheDocument();
      expect(document.querySelector("svg")).toHaveAttribute(
        "data-file-name",
        "SvgChevronLeftIcon"
      );
    });
  });

  it.each(["/a-link", "/another-link"])(
    "should render back link to %s",
    (to) => {
      getRenderer({ backButtonTo: to });
      expect(getByRole("link", { name: BACK_BUTTON_LABEL })).toHaveAttribute(
        "href",
        to
      );
    }
  );

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();

    expect(container).toMatchSnapshot();
  });
});

function getRenderer({
  pageTitle = "Test Title",
  primaryElement = <div>Primary</div>,
  secondaryElement = <div>Secondary</div>,
  ...rest
}: Partial<ComponentProps<typeof Header>> = {}) {
  return render(
    <Router>
      <Header
        {...rest}
        pageTitle={pageTitle}
        primaryElement={primaryElement}
        secondaryElement={secondaryElement}
      />
    </Router>
  );
}
