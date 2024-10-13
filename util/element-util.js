export function addClassesTo(element, ...classes) {
  element?.classList?.add(...classes);
}

export function removeClassesFrom(element, ...classes) {
  element?.classList?.remove(...classes);
}

export function addClassesToSelector(selector, ...classes) {
  const element = document.querySelector(selector);
  addClassesTo(element, ...classes);
}

export function removeClassesFromSelector(selector, ...classes) {
  const element = document.querySelector(selector);
  removeClassesFrom(element, ...classes);
}
