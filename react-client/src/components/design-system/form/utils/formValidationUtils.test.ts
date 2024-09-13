import { isEmailValid } from './formValidationUtils';

describe('Email Validation', () => {
  it.each([
    ["abc-d@mail.com", true],
    ["abc.def@mail.com", true],
    ["abc@mail.com", true],
    ["abc_def@mail.com", true],
    ["abc.def@mail-archive.com", true],
    ["abc.def@mail.org", true],
    ["abc.def@mail.com", true],
  ])('should be a valid email: %s', (email, expected) => {
    expect(isEmailValid(email)).toBe(expected);
  });

  it.each([
    ["abc-@mail.com", false],
    ["abc..def@mail.com", false],
    [".abc@mail.com", false],
    ["abc#def@mail.com", false],
    ["abc.def@mail.c", false],
    ["abc.def@mail#archive.com", false],
    ["abc.def@mail", false],
    ["abc.def@mail..com", false],
    [".as#das..da-@ema#il..c", false],
  ])('should be an invalid email: %s', (email, expected) => {
    expect(isEmailValid(email)).toBe(expected);
  });
});