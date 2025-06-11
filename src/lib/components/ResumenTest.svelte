<script lang="ts">
  export let preguntas: any[];
  export let respuestasUsuario: Record<number, string>;
  export let respuestasCorrectas: number;
</script>

<div class="mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
  <h2 class="text-2xl font-bold text-blue-700 mb-4 text-center">📊 Resumen del Test</h2>

  <div class="text-center mb-6">
    <p class="text-lg font-medium text-gray-800">
      Respondiste correctamente {respuestasCorrectas} de {preguntas.length} preguntas.
    </p>
    <div class="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        class="bg-green-500 h-4 transition-all"
        style="width: {(respuestasCorrectas / preguntas.length) * 100}%"
      ></div>
    </div>
  </div>

  <table class="w-full text-sm border-collapse mt-6">
    <thead>
      <tr class="bg-blue-50 text-blue-800 font-semibold">
        <th class="p-2 border">#</th>
        <th class="p-2 border text-left">Pregunta</th>
        <th class="p-2 border">Respuesta</th>
        <th class="p-2 border">Resultado</th>
      </tr>
    </thead>
    <tbody>
      {#each preguntas as pregunta, i}
        <tr class="hover:bg-gray-50">
          <td class="p-2 border text-center">{i + 1}</td>
          <td class="p-2 border">{pregunta.enunciado}</td>
          <td class="p-2 border text-center">{respuestasUsuario[i + 1] ?? '—'}</td>
          <td class="p-2 border text-center">
            {#if respuestasUsuario[i + 1] === pregunta.respuestaCorrecta}
              ✅
            {:else}
              ❌
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
