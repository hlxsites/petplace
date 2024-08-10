export function isCamelCaseFormat(text: string): boolean {
  return /^[a-z]+(?:[A-Z][a-z]+)*$/.test(text);
}

export function convertToTitleCase(phrase: string): string {
  return phrase
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function convertToCamelCase(phrase: string): string {
  const formattedPhrase = phrase.toLowerCase();

  return isCamelCaseFormat(phrase)
    ? phrase
    : formattedPhrase
        .split(/\s+/)
        .map((word, index) => (index === 0 ? word : convertToTitleCase(word)))
        .join("");
}
