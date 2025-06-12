<script lang="ts">
  import MathText from './MathText.svelte';

  export let content: string;
  export let inline: boolean = false;

  function contieneLatex(texto: string) {
    return /\\\(|\\\[|\\frac|\\sqrt|\\pi|\\sum|\\int/.test(texto);
  }
</script>

{#if contieneLatex(content)}
  <MathText {content} {inline} />
{:else}
  {#if inline}
    <span>{content}</span>
  {:else}
    <p>{content}</p>
  {/if}
{/if}
