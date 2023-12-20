// export type ICurrencyTypes = {
//   currency: string;
//   abbreviation: string;
//   sign?: string;
// };

const CurrencyList = [
  { abbreviation: "IDR", currency: "Indonesian Rupiah", sign: "Rp" },
  { abbreviation: "USD", currency: "US Dollar", sign: "$" },
  { abbreviation: "EUR", currency: "European Euro", sign: "€" },
  { abbreviation: "JPY", currency: "Japanese Yen", sign: "¥" },
  { abbreviation: "SGD", currency: "Singaporean Dollar", sign: "$" },
  { abbreviation: "SAR", currency: "Arabian Riyal", sign: "﷼" },
  { abbreviation: "CNY", currency: "Chinese Yuan", sign: "¥" },
] as const;

export type ICurrencyTypes = (typeof CurrencyList)[number]["abbreviation"];
