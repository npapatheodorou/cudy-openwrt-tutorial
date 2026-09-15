/** localStorage with an in-memory fallback for private windows or blocked site data. */
const PREFIX = 'cudyowrt.';
const memory = new Map<string, string | null>();

export const storage = {
  get(key: string): string | null {
    if (memory.has(key)) return memory.get(key) ?? null;
    try {
      return localStorage.getItem(PREFIX + key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    memory.set(key, value);
    try {
      localStorage.setItem(PREFIX + key, value);
    } catch {
      /* storage unavailable: keep the in-memory value */
    }
  },
  remove(key: string): void {
    memory.set(key, null);
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* storage unavailable */
    }
  },
};
