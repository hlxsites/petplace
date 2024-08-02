interface PluralProps<T = unknown> {
  countFrom: number | T[];
  one: string;
  other: string;
  zero?: string;
}

export function plural({ countFrom, one, other, zero }: PluralProps) {
  const count = Array.isArray(countFrom) ? countFrom.length : countFrom;

  if (count === 0 && zero) {
    return zero;
  }
  if (count < 2) {
    return one;
  }
  return other;
}
