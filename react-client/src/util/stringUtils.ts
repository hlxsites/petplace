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
