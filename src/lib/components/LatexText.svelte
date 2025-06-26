<script lang="ts">
  import katex from 'katex';
  import { onMount } from 'svelte';

  export let text: string;
  let rendered: string = '';

  onMount(() => {
    rendered = katex.renderToString(text, {
      throwOnError: false,
      displayMode: false
    });
  });
</script>

<div class="text-gray-800 text-base" use:html={rendered}></div>
