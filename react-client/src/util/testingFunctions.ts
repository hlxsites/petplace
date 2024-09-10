import { screen } from "@testing-library/react";

export function getSelectedTab() {
  return screen.getByRole("tab", { selected: true }).textContent;
}

export async function findByTextContent(
  textMatch: string | RegExp
): Promise<HTMLElement> {
  // @ts-expect-error - TS doesn't understand what we want with the utility here
  return screen.findByText(findByContext(textMatch));
}

export function getByTextContent(textMatch: string | RegExp): HTMLElement {
  // @ts-expect-error - TS doesn't understand what we want with the utility here
  return screen.getByText(findByContext(textMatch));
}

export type MatcherFunction = (
  content: string,
  element: Element | null
) => boolean;

function findByContext(textMatch: string | RegExp) {
  return (_: string, node: Element) => {
    const hasText = (inNode: Element): boolean => {
      if (typeof textMatch === "string") {
        return inNode.textContent === textMatch;
      }
      return inNode.textContent?.match(textMatch) !== null;
    };

    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      (child) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  };
}
