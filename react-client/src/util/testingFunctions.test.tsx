import { render } from "@testing-library/react";

import {
  getSelectedTab,
} from "./testingFunctions";

describe("testingFunctions", () => {
  describe("getSelectedTab", () => {
    it("should return the selected tab", () => {
      render(<TestTabsComponent />);
      expect(getSelectedTab()).toBe("Second tab");
    });
  });
});

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
