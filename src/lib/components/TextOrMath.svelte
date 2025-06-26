<script lang="ts">
  import MathText from './MathText.svelte';
  export let content: string;
  export let inline: boolean = false;
  export let forcePlainText: boolean = false;

function contieneLatex(texto: string) {
  return /^\$.*\$$/.test(texto.trim()); // solo si está delimitado por $
}
</script>

{#if !forcePlainText && contieneLatex(content)}
  <MathText {content} {inline} />
{:else}
  {#if inline}
    <span class="text-base">{content}</span>
  {:else}
    <p class="text-base whitespace-pre-wrap">{content}</p>
  {/if}
{/if}
