const dotRE = /\./g;
const dotPattern = '\\.';

const restRE = /\*\*$/g;
const restPattern = '(.+)';

const globRE = /(?:\*\*\/|\*\*|\*)/g;
const globPatterns = {
  '*': '([^/]+)',
  '**': '(.+/)?([^/]+)',
  '**/': '(.+/)?',
};

function mapToPattern(str) {
  return globPatterns[str];
}

function replace(glob) {
  return glob
    .replace(dotRE, dotPattern)
    .replace(restRE, restPattern)
    .replace(globRE, mapToPattern);
}

function join(globs) {
  return `((${globs.map(replace).join(')|(')}))`;
}

function globRegex(glob) {
  return new RegExp(`^${(Array.isArray(glob) ? join : replace)(glob)}$`);
}

globRegex.replace = replace;
export default globRegex;
