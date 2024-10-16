import { InputsUnion } from "../types/formTypes";

export function disableInput(
  element: InputsUnion,
  disable: boolean
): InputsUnion {
  return { ...element, disabledCondition: disable };
}
