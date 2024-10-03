// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import fetchMock from "jest-fetch-mock";

jest.setTimeout(15000);

// adds the 'fetchMock' global variable and rewires 'fetch' global to call 'fetchMock' instead of the real implementation
fetchMock.enableMocks();

// changes default behavior of fetchMock to use the real 'fetch' implementation and not mock responses
fetchMock.dontMock();

// Fix 'ResizeObserver is not defined' error when running tests
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.console = {
  ...console,
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

// Mock toLocaleDateString to always return 'en-US' format when running tests
const origDate = global.Date.prototype.toLocaleDateString;
jest
  .spyOn(global.Date.prototype, "toLocaleDateString")
  .mockImplementation(function () {
    // @ts-expect-error - this is a mock
    return origDate.call(this, "en-US");
  });
