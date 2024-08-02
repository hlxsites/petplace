export function upperCaseFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function upperCaseFirstLetterRestLowerCase(text: string) {
  return text.replace(/(^\w)(.*)/g, replaceFirstUpperCaseRestLowerCase);
}

export function upperCaseFirstLetterOfEachWord(text: string) {
  return text.replace(/(^\w|\s\w)(\S*)/g, replaceFirstUpperCaseRestLowerCase);
}

function replaceFirstUpperCaseRestLowerCase(
  _: string,
  first: string,
  rest: string
) {
  return first.toUpperCase() + rest.toLowerCase();
}

type PluralProps<T = unknown> = {
  countFrom: number | T[];
  one: string;
  other: string;
  zero?: string;
};

export function plural({ countFrom, one, other, zero }: PluralProps) {
  const count = Array.isArray(countFrom) ? countFrom.length : countFrom;

  if (count === 0 && zero) {
    return zero;
  }
  if (count < 2) {
    return one;
  }
  return other;
}
