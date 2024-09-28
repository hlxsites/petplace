export const COUNTRIES = [
  {
    id: "CA",
    label: "CANADA",
  },
  {
    id: "US",
    label: "United States",
  },
];

export const COUNTRIES_LABELS = COUNTRIES.map(({ label }) => label);

export const getCountryLabel = (countryId: string) => {
  const country = COUNTRIES.find(({ id }) => id === countryId);
  if (country) return country.label;

  // Fallback for USA
  if (countryId === "USA") return "United States";
  return null;
};
