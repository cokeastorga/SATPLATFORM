import { writable } from 'svelte/store';

export const darkMode = writable(false);

export function toggleDarkMode() {
  darkMode.update((prev) => {
    const next = !prev;
    localStorage.setItem('dark', next.toString());
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return next;
  });
}
