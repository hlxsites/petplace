import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";
import Select from "./Select";

type SelectProps = ComponentProps<typeof Select>;

const { getByRole, queryByRole } = screen;

// @ts-expect-error - Mocking getBoundingClientRect to fix tests running react-virtualizaed
Element.prototype.getBoundingClientRect = jest.fn(() => {
  return {
    width: 120,
    height: 120,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };
});

describe("<Select />", () => {
  it.each(["A label", "Another label"])(
    "should render an input with a label %p",
    (expected) => {
      getRenderer({ label: expected, required: true });
      expect(getByRole("combobox", { name: expected })).toBeInTheDocument();
    }
  );

  it("should include optional text in the label when required is false", () => {
    getRenderer({ label: "A label", required: false });
    expect(
      getByRole("combobox", { name: "A label (optional)" })
    ).toBeInTheDocument();
  });

  it.each(["a-id", "another-id"])(
    "should render an input with id %p-input",
    (id) => {
      getRenderer({ id });
      expect(getByRole("combobox")).toHaveAttribute("id", `${id}-input`);
    }
  );

  it("should render options", async () => {
    const options = ["Option A", "Option B", "Option C"];
    getRenderer({ options });

    await userEvent.click(getByRole("combobox"));
    options.forEach((option) => {
      expect(getByRole("option", { name: option })).toBeInTheDocument();
    });
  });

  it("should render an input with some classes", () => {
    getRenderer();
    expect(getByRole("combobox")).toHaveClass(
      "placeholder:text-text-hinted disabled:bg-background-disabled disabled:text-text-disabled h-full w-full bg-neutral-white p-base outline-none"
    );
  });

  it("shouldn't render with class 'input-error' when hasError is false", () => {
    getRenderer({ errorMessage: undefined });
    expect(getByRole("combobox")).not.toHaveClass("input-error");
    expect(getByRole("combobox")).not.toHaveAccessibleErrorMessage();
  });

  it.each(["An error", "Another error message"])(
    "should render an input with error message",
    (errorMessage) => {
      getRenderer({ errorMessage });
      expect(getByRole("combobox")).toHaveClass("text-text-danger-default");
      expect(getByRole("combobox")).toHaveAccessibleErrorMessage(errorMessage);
    }
  );

  it.each(["A placeholder", "Another placeholder"])(
    "should render an input with placeholder %p",
    (placeholder) => {
      getRenderer({ placeholder });
      expect(getByRole("combobox")).toHaveAttribute("placeholder", placeholder);
    }
  );

  it("should be clearable by default", () => {
    getRenderer({ options: getOptions(), value: "Option A" });
    expect(getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("should not be clearable when required is true", () => {
    getRenderer({ required: true, options: getOptions(), value: "Option A" });
    expect(queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it.each(["Option A", "Option B"])(
    "should render with pre-selected value %p",
    (expected) => {
      getRenderer({ options: getOptions(), value: expected });
      expect(getByRole("combobox")).toHaveValue(expected);
    }
  );

  describe("onChange callback", () => {
    it("should call it when an option is selected", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.click(getByRole("combobox"));

      await userEvent.click(getByRole("option", { name: "Option B" }));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenNthCalledWith(1, "Option B");

      await userEvent.click(getByRole("combobox"));
      await userEvent.click(getByRole("option", { name: "Option C" }));
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(2, "Option C");
    });

    it("should call it when the value is cleared", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions(), value: "Option A" });
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.click(getByRole("button", { name: "Clear" }));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenNthCalledWith(1, "");
    });

    it("should call it when the value is typed, confirmed with enter and it is in the options", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.type(getByRole("combobox"), "option b{enter}");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenNthCalledWith(1, "Option B");

      await userEvent.clear(getByRole("combobox"));
      await userEvent.type(getByRole("combobox"), "option A{enter}");
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(2, "Option A");
    });

    it("should not call it when the value is typed, confirmed with enter and it is not in the options", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });

      await userEvent.type(getByRole("combobox"), "option d{enter}");
      expect(onChange).not.toHaveBeenCalled();
    });

    it("should call it when the value is typed, confirmed with tab and it is in the options", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.type(getByRole("combobox"), "option b{tab}");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenNthCalledWith(1, "Option B");

      await userEvent.clear(getByRole("combobox"));
      await userEvent.type(getByRole("combobox"), "option A{tab}");
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(2, "Option A");
    });

    it("should not call it when the value is typed, confirmed with tab and it is not in the options", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });

      await userEvent.type(getByRole("combobox"), "option d{tab}");
      expect(onChange).not.toHaveBeenCalled();
    });

    it("should call it when the value is typed, confirmed with blur and it is in the options", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.type(getByRole("combobox"), "option b");
      await userEvent.tab();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenNthCalledWith(1, "Option B");

      await userEvent.clear(getByRole("combobox"));
      await userEvent.type(getByRole("combobox"), "option A");
      await userEvent.tab();
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(2, "Option A");
    });

    it("should not call it when the value is typed, confirmed with blur and it is not in the options", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });

      await userEvent.type(getByRole("combobox"), "option d");
      await userEvent.tab();
      expect(onChange).not.toHaveBeenCalled();
    });

    it("should call it when the user select an option using keyboard", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.click(getByRole("combobox"));
      await userEvent.type(getByRole("combobox"), "{arrowdown}{enter}");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenNthCalledWith(1, "Option A");

      await userEvent.clear(getByRole("combobox"));
      await userEvent.type(
        getByRole("combobox"),
        "{arrowdown}{arrowdown}{enter}"
      );
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(2, "Option B");
    });

    it("should not call it when the value is not in the options", async () => {
      const onChange = jest.fn();
      getRenderer({ onChange, options: getOptions() });
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.click(getByRole("combobox"));
      await userEvent.type(getByRole("combobox"), "d");
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});

// Helpers
function getRenderer({
  id = "select-id",
  label = "The Select",
  onChange = jest.fn(),
  options = [],
  value = "",
  ...rest
}: Partial<SelectProps> = {}) {
  return render(
    <Select
      label={label}
      id={id}
      onChange={onChange}
      options={options}
      value={value}
      {...rest}
    />
  );
}

function getOptions() {
  return ["Option A", "Option B", "Option C"];
}
