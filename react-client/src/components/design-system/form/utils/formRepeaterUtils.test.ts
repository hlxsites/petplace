import { RepeaterMetadata } from "../types/formTypes";
import {
  idWithRepeaterMetadata,
  textWithRepeaterMetadata,
} from "./formRepeaterUtils";

const DEFAULT_ID = "repeater-id";

describe("textWithRepeaterMetadata", () => {
  it.each([2, 10])(
    "should replace '{{index}}' with the %i plus one",
    (index) => {
      const text = "Item {{index}}";
      const metadata: RepeaterMetadata = { index, repeaterId: DEFAULT_ID };
      const result = textWithRepeaterMetadata(text, metadata);
      expect(result).toBe(`Item ${index + 1}`);
    }
  );

  it.each(["a text", "another text"])(
    "should return the original text %p when the metadata is undefined",
    (text) => {
      const result = textWithRepeaterMetadata(text, undefined);
      expect(result).toBe(text);
    }
  );
});

describe("idWithRepeaterMetadata", () => {
  it.each([1, 3])(
    "should append '_repeater_' and the index %i to the id",
    (index) => {
      const id = "input";
      const metadata: RepeaterMetadata = { index, repeaterId: DEFAULT_ID };
      const result = idWithRepeaterMetadata(id, metadata);
      expect(result).toBe(`input_repeater_${index}`);
    }
  );

  it.each(["a-id", "another-id"])(
    "should return the original id %p when the metadata is undefined",
    (id) => {
      const result = idWithRepeaterMetadata(id, undefined);
      expect(result).toBe(id);
    }
  );
});
