import { announce } from './a11y';
import { storage } from './storage';

/** Flip between light and dark; the first toggle starts from the system preference. */
export function toggleTheme(): void {
  const root = document.documentElement;
  const current = root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  storage.set('theme', next);
  announce(`${next === 'dark' ? 'Dark' : 'Light'} theme`);
}
