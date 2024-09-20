import { RepeaterMetadata } from "../types/formTypes";

export const textWithRepeaterMetadata = (
  text: string,
  metadata: RepeaterMetadata | undefined
) => {
  if (metadata) {
    const indexToDisplay = metadata.index + 1;
    return text.replace("{{index}}", indexToDisplay.toString());
  }
  return text;
};

export const idWithRepeaterMetadata = (
  id: string,
  metadata: RepeaterMetadata | undefined
) => {
  if (metadata) return `${id}_repeater_${metadata.index}`;
  return id;
};
