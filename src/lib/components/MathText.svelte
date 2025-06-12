<script lang="ts">
  import katex from 'katex';
  import { onMount } from 'svelte';

  export let content: string = '';
  export let inline: boolean = false;

  let rendered = '';

  onMount(() => {
    try {
      rendered = katex.renderToString(content, {
        throwOnError: false,
        displayMode: !inline
      });
    } catch (e) {
      console.error('Error renderizando fórmula:', e);
      rendered = content; // fallback
    }
  });
</script>

<div class="katex-content">{@html rendered}</div>
