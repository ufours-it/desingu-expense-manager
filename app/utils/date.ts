export function parseToDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  if (!value || typeof value !== 'string') return new Date(NaN);
  // If it's plain YYYY-MM-DD, build with numeric parts to avoid inconsistent parsing on Android
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map((v) => Number(v));
    return new Date(y, m - 1, d);
  }
  // Fallback to Date constructor for full ISO strings
  return new Date(value);
}
