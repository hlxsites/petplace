/* Get multiple random elements from an Array */
export const getRandomItems = (array, count) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/* extract pet name from api returned name string */
export const extractName = (nameString) => {
  return nameString.replace(/\s*\([^)]*\)/, '').trim();
}

/*format phone number */
export const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}
