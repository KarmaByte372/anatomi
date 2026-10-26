export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function sample<T>(items: readonly T[], n: number): T[] {
  return shuffle(items).slice(0, n);
}

/** Aynı gün içinde sabit kalan, güne göre değişen indeks (günün ipucu vb.) */
export function dailyIndex(length: number, date = new Date()): number {
  const key = date.getFullYear() * 1000 + date.getMonth() * 40 + date.getDate();
  return key % length;
}
