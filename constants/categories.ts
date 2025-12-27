export type Category = {
  label: string;
  value: string;
};

export type Currency = {
  code: string;
  symbol: string;
};

export const CATEGORIES: readonly Category[] = [
  { label: "Food", value: "Food" },
  { label: "Transport", value: "Transport" },
  { label: "Shopping", value: "Shopping" },
  { label: "Salary", value: "Salary" },
  { label: "Travel", value: "Travel" },
  { label: "Rent", value: "Rent" },
  { label: "Medical", value: "Medical" },
  { label: "Other", value: "Other" },
];

export const CURRENCIES: readonly Currency[] = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

