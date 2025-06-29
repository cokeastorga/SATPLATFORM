<script lang="ts">
  import { page } from '$app/stores';
  import { toggleDarkMode, darkMode } from '$lib/stores/theme';
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';


  // Guardamos preferencia del usuario (si aplica)
  onMount(() => {
  const stored = localStorage.getItem('dark');
  const isDark = stored === 'true';
  darkMode.set(isDark);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

</script>

<header class="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
    <h1 class="text-xl font-bold text-blue-700 dark:text-blue-300 tracking-wide">
      SAT Práctica IA
    </h1>

    <nav class="space-x-4 hidden sm:block">
      <a href="/" class="text-sm text-gray-700 dark:text-gray-200 hover:underline">Inicio</a>
      <a href="/practice" class="text-sm text-gray-700 dark:text-gray-200 hover:underline">Práctica</a>
    </nav>

   <button
  on:click={toggleDarkMode}
  class="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
>
  <span class="text-lg"  transition:scale={{ duration: 200 }}>
  {#if $darkMode}
    ☀️
  {:else}
    🌙
  {/if}
</span>

  <span class="hidden sm:inline">
    { $darkMode ? 'Modo Claro' : 'Modo Oscuro' }
  </span>
</button>

  </div>
</header>
