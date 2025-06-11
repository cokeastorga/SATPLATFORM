import { writable } from 'svelte/store';

export const progreso = writable({ total: 0, actual: 0 });
