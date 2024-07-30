import { render, screen } from "@testing-library/react";
import type { ConditionalProps } from "./Conditional";
import { Conditional } from "./Conditional";

const { getByText, queryByText } = screen;

describe("<Conditional />", () => {
  describe("using the `when` prop", () => {
    it("should display children when true", () => {
      getRenderer({
        children: <button>Save</button>,
        when: true,
      });
      expect(getByText("Save")).toBeInTheDocument();
    });

    it("should not display children when false", () => {
      getRenderer({
        children: <button>Save</button>,
        when: false,
      });
      expect(queryByText("Save")).not.toBeInTheDocument();
    });

    it("should not display ifFalse when true", () => {
      getRenderer({
        children: <button>Save</button>,
        ifFalse: <button>Cancel</button>,
        when: true,
      });
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });

    it("should display ifFalse when false", () => {
      getRenderer({
        children: <button>Save</button>,
        ifFalse: <button>Cancel</button>,
        when: false,
      });
      expect(getByText("Cancel")).toBeInTheDocument();
    });
  });

  describe("using the `whenTruthy` prop", () => {
    it.each([true, [{ foo: "bar" }], "true", "Floobles"])(
      "should display children when %s",
      (whenTruthy) => {
        getRenderer({
          children: <button>Save</button>,
          whenTruthy,
        });
        expect(getByText("Save")).toBeInTheDocument();
      }
    );

    it.each([false, "", undefined, null, 0])(
      "should not display children when %s",
      (whenTruthy) => {
        getRenderer({
          children: <button>Save</button>,
          whenTruthy,
        });
        expect(queryByText("Save")).not.toBeInTheDocument();
      }
    );

    it("should render with a render function whenTruthy is a truthy value", () => {
      const whenTruthy = "foibles";
      getRenderer({
        children: (value) => <span>{value}</span>,
        whenTruthy,
      });
      expect(getByText(whenTruthy)).toBeInTheDocument();
    });

    it("should not display ifFalse when true", () => {
      getRenderer({
        children: <button>Save</button>,
        ifFalse: <button>Cancel</button>,
        whenTruthy: true,
      });
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });

    it("should display ifFalse when false", () => {
      getRenderer({
        children: <button>Save</button>,
        ifFalse: <button>Cancel</button>,
        whenTruthy: false,
      });
      expect(getByText("Cancel")).toBeInTheDocument();
    });
  });
});

function getRenderer<T>(props: ConditionalProps<T>) {
  return render(<Conditional {...props} />);
}
