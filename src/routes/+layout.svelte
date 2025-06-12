<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import 'katex/dist/katex.min.css';
</script>

<Header />

<main class="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 min-h-screen">
  <slot />
</main>
