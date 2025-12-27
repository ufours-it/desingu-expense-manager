export function parseToDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  if (!value || typeof value !== 'string') return new Date(NaN);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map((v) => Number(v));
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

export default undefined as unknown as null;
