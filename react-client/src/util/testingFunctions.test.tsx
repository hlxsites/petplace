import { render } from "@testing-library/react";

import {
  findByTextContent,
  getByTextContent,
  getSelectedTab,
} from "./testingFunctions";

describe("testingFunctions", () => {
  describe("getSelectedTab", () => {
    it("should return the selected tab", () => {
      render(<TestTabsComponent />);
      expect(getSelectedTab()).toBe("Second tab");
    });
  });

  describe("findByTextContent", () => {
    it.each([
      "Hello World",
      "Another example with multiple Elements",
      /Using regex [0-9]{3}-[0-9]{3}-[0-9]{4}/,
    ])("should assert finding %p", async (expected) => {
      render(<TestComponent />);
      expect(await findByTextContent(expected)).toBeInTheDocument();
    });
  });

  describe("getByTextContent", () => {
    it.each([
      "Hello World",
      "Another example with multiple Elements",
      /Using regex [0-9]{3}-[0-9]{3}-[0-9]{4}/,
    ])("should assert getting %p", (expected) => {
      render(<TestComponent />);
      expect(getByTextContent(expected)).toBeInTheDocument();
    });
  });
});

// Test utilities
function TestComponent() {
  return (
    <div>
      <p>
        Hello <span>World</span>
      </p>
      <p>
        Another <span>example</span> with multiple <strong>Elements</strong>
      </p>
      <p>
        Using regex <span>950-294-3660</span>
      </p>
    </div>
  );
}

function TestTabsComponent() {
  return (
    <div role="tablist">
      <button aria-selected="false" role="tab">
        First tab
      </button>
      <button aria-selected="true" role="tab">
        Second tab
      </button>
      <button aria-selected="false" role="tab">
        Third tab
      </button>
    </div>
  );
}
