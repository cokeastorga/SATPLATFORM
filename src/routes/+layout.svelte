<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import 'katex/dist/katex.min.css';
  import { onMount } from 'svelte';
  import { darkMode } from '$lib/stores/theme';

  onMount(() => {
    const stored = localStorage.getItem('dark');
    const active = stored === 'true';
    darkMode.set(active);

    if (active) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark'); // ❗ importante
    }
  });
</script>

<Header />

<main class="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
  <slot />
</main>