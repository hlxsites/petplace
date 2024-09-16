import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";
import { DisplayUncontrolledForm } from "./DisplayUncontrolledForm";
import { ElementUnion, FormSchema } from "./types/formTypes";

const { getByRole, getAllByRole, queryByRole, getByText, queryByText } = screen;

const DEFAULT_SUBMIT: ElementUnion = {
  elementType: "button",
  id: "save",
  label: "Save",
  type: "submit",
};

const DEFAULT_SCHEMA: FormSchema = {
  children: [DEFAULT_SUBMIT],
  id: "test-id",
  version: 0,
};

describe("<DisplayForm />", () => {
  it.each(["an-id", "another-id"])("should have id: %s", (expected) => {
    const schema = { ...DEFAULT_SCHEMA, id: expected };
    getRenderer({ schema });
    expect(getByRole("form")).toHaveAttribute("id", expected);
  });

  it("should render a section with title and description", () => {
    const sectionTitle = "Section title";
    const sectionDescription = "Section description";
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "section",
          id: "test-id",
          title: { label: sectionTitle },
          description: { label: sectionDescription },
          children: [],
        },
      ],
    };
    const { container } = getRenderer({ schema });

    expect(container.querySelector("section")).toBeInTheDocument();
    expect(getByRole("heading", { name: sectionTitle })).toBeInTheDocument();
    expect(getByText(sectionDescription)).toBeInTheDocument();
  });

  it("should render a section with NO title NOR description", () => {
    const sectionTitle = "Section title";
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "section",
          id: "test-id",
          title: { label: sectionTitle, hideLabel: true },
          children: [],
        },
      ],
    };
    const { container } = getRenderer({ schema });

    expect(container.querySelector("section")).toBeInTheDocument();
    expect(
      queryByRole("heading", { name: sectionTitle })
    ).not.toBeInTheDocument();
  });

  it("should render a html element", () => {
    const htmlContent = "This is an html element";
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "html",
          content: <h1>{htmlContent}</h1>,
        },
      ],
    };
    getRenderer({ schema });

    expect(getByRole("heading", { name: htmlContent })).toBeInTheDocument();
  });

  it("should render a row", () => {
    const rowId = "row-test-id";
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "row",
          id: rowId,
          children: [],
        },
      ],
    };
    const { container } = getRenderer({ schema });

    expect(container.querySelector("div")).toHaveAttribute("id", rowId);
  });

  it("should render a phone input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          type: "phone",
        },
      ],
    };
    getRenderer({ schema });

    expect(getByRole("combobox")).toBeInTheDocument();
    expect(getByRole("textbox")).toBeInTheDocument();
  });

  it("should render a select input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          options: ["On", "Off"],
          type: "select",
        },
      ],
    };
    getRenderer({ schema });

    expect(getByRole("combobox")).toBeInTheDocument();
  });

  it("should render a checkboxGroup input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          options: ["On"],
          type: "checkboxGroup",
        },
      ],
    };
    getRenderer({ schema });

    expect(getByRole("checkbox")).toBeInTheDocument();
  });

  it("should render a radio input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          options: ["On"],
          type: "radio",
        },
      ],
    };
    getRenderer({ schema });

    expect(getByRole("radio")).toBeInTheDocument();
  });

  it("should render a switch input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          type: "switch",
        },
      ],
    };
    getRenderer({ schema });

    expect(getByRole("switch")).toBeInTheDocument();
  });

  it("should render a password input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          type: "password",
        },
      ],
    };
    const { container } = getRenderer({ schema });

    expect(container.querySelector("input")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("should render a number input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          type: "number",
        },
      ],
    };
    getRenderer({ schema });

    const input = getByRole("spinbutton");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
  });

  it("should render a email input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          type: "email",
        },
      ],
    };
    getRenderer({ schema });

    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  it("should render a text input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          type: "text",
        },
      ],
    };
    getRenderer({ schema });

    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("should render a textarea input", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "test-id",
          label: "Test label",
          type: "textarea",
        },
      ],
    };
    getRenderer({ schema });

    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toEqual("TEXTAREA");
  });

  it("should render a submit button", () => {
    getRenderer({ schema: DEFAULT_SCHEMA });

    const submitButton = getByRole("button", { name: DEFAULT_SUBMIT.label });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should NOT render the button", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "button",
          id: "save",
          label: "Save",
          type: "submit",
          shouldDisplay: false,
        },
      ],
    };
    getRenderer({ schema });

    expect(queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
  });

  it("should render a disabled button", () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "button",
          id: "name",
          label: "Test",
          type: "button",
          disabledCondition: true,
        },
      ],
    };
    getRenderer({ schema });

    expect(getByRole("button", { name: "Test" })).toBeDisabled();
  });

  it("should render a disabled button until form values change", async () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "input",
          id: "name",
          label: "What is your pet name?",
          requiredCondition: true,
          type: "text",
        },
        {
          elementType: "button",
          id: "name",
          label: "Test",
          type: "button",
          enabledCondition: true,
        },
      ],
    };
    getRenderer({ schema });

    expect(getByRole("button", { name: "Test" })).toBeDisabled();
    await userEvent.type(getByRole("textbox"), "test");
    expect(getByRole("button", { name: "Test" })).not.toBeDisabled();
  });

  it.each(["Bob", "Duda"])(
    "should load initial values for pet name %p",
    (expected) => {
      const schema: FormSchema = {
        ...DEFAULT_SCHEMA,
        children: [
          {
            elementType: "input",
            id: "name",
            label: "What is your pet name?",
            type: "text",
          },
        ],
      };
      getRenderer({ schema, initialValues: { name: expected } });
      expect(getByRole("textbox")).toHaveValue(expected);
    }
  );

  it("should render a repeater and manage repetition", async () => {
    const schema: FormSchema = {
      ...DEFAULT_SCHEMA,
      children: [
        {
          elementType: "repeater",
          id: "test-id",
          minRepeat: 1,
          children: [
            {
              elementType: "input",
              id: "test-id",
              label: "Test label",
              type: "text",
            },
          ],
        },
      ],
    };
    getRenderer({ schema });
    expect(getAllByRole("textbox").length).toEqual(1);

    const addRepeaterButton = getByRole("button", { name: "Add" });
    await userEvent.click(addRepeaterButton);
    expect(getAllByRole("textbox").length).toEqual(2);

    // Can remove repeater
    const removeRepeaterButton = getByRole("button", { name: "Remove" });
    await userEvent.click(removeRepeaterButton);
    expect(getAllByRole("textbox").length).toEqual(1);
  });

  describe("with a required field", () => {
    it("should not display validation error by default", () => {
      const errorMessage = "This field is required";
      const schema: FormSchema = {
        ...DEFAULT_SCHEMA,
        children: [
          {
            elementType: "input",
            id: "name",
            label: "What is your pet name?",
            requiredCondition: true,
            type: "text",
            errorMessage,
          },
          DEFAULT_SUBMIT,
        ],
      };
      getRenderer({ schema });
      expect(queryByText(errorMessage)).not.toBeInTheDocument();
    });

    it("should display validation error when user try to submit it", async () => {
      const errorMessage = "This field is required";
      const schema: FormSchema = {
        ...DEFAULT_SCHEMA,
        children: [
          {
            elementType: "input",
            id: "name",
            label: "What is your pet name?",
            requiredCondition: true,
            type: "text",
            errorMessage,
          },
          DEFAULT_SUBMIT,
        ],
      };
      getRenderer({ schema });

      await userEvent.click(getByRole("button"));
      expect(getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe("onSubmit callback", () => {
    it("should call it", async () => {
      const onSubmit = jest.fn();
      getRenderer({ schema: DEFAULT_SCHEMA, onSubmit });
      expect(onSubmit).not.toHaveBeenCalled();

      await userEvent.click(getByRole("button"));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("should not call it when there is a required field without a value on it", async () => {
      const onSubmit = jest.fn();
      getRenderer({
        schema: {
          ...DEFAULT_SCHEMA,
          children: [
            {
              elementType: "input",
              id: "name",
              label: "Required field",
              requiredCondition: true,
              type: "text",
            },
            DEFAULT_SUBMIT,
          ],
        },
        onSubmit,
      });

      await userEvent.click(getByRole("button"));
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should call it when there is a required field with a value on it", async () => {
      const onSubmit = jest.fn();
      getRenderer({
        schema: {
          ...DEFAULT_SCHEMA,
          children: [
            {
              elementType: "input",
              id: "name",
              label: "Required field",
              requiredCondition: true,
              type: "text",
            },
            DEFAULT_SUBMIT,
          ],
        },
        onSubmit,
        initialValues: {
          name: "test",
        },
      });

      await userEvent.click(getByRole("button"));
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});

// Helpers
function getRenderer({
  onSubmit = jest.fn(),
  schema = DEFAULT_SCHEMA,
  ...rest
}: Partial<ComponentProps<typeof DisplayUncontrolledForm>> = {}) {
  return render(
    <DisplayUncontrolledForm onSubmit={onSubmit} schema={schema} {...rest} />
  );
}
