<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import TextOrMath from '$lib/components/TextOrMath.svelte';
	import MathText from '$lib/components/MathText.svelte';

	let preguntas: any[] = [];
	let respuestasUsuario: Record<number, string> = {};
	let respuestasCorrectas = 0;
	let puntaje = 0;
	let cargando = true;

	onMount(() => {
		const dataString = localStorage.getItem('resultadosTest');

		if (!dataString) {
			goto('/');
			return;
		}

		try {
			const data = JSON.parse(dataString);
			preguntas = data.preguntas;
			respuestasUsuario = data.respuestasUsuario;
			respuestasCorrectas = data.respuestasCorrectas;
			puntaje = Math.round((respuestasCorrectas / preguntas.length) * 600 + 200);
		} catch (error) {
			console.error('Error leyendo resultados:', error);
			goto('/');
		}

		// Simulamos un pequeño tiempo de carga
		setTimeout(() => {
			cargando = false;
		}, 1000);
	});

	function esCorrecta(i: number) {
		return respuestasUsuario[i] === preguntas[i].respuestaCorrecta;
	}

	function volverResumen() {
		goto('/resumen');
	}
</script>

<svelte:head>
	<title>Resultados del Test</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-16">
	<div class="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl transition-all">
		{#if cargando}
			<LoadingSpinner mensaje="🧠 Calculando resultados..." />
		{:else}
			<h1 class="mb-4 text-center text-3xl font-bold text-blue-700" in:fade={{ duration: 500 }}>
				📊 Resultados del Test
			</h1>

			<div class="mb-8 text-center" in:fade={{ delay: 200, duration: 600 }}>
				<p class="text-lg text-gray-700">
					Respondiste correctamente
					<strong class="text-green-600">{respuestasCorrectas}</strong> de
					<strong class="text-blue-700">{preguntas.length}</strong> preguntas.
				</p>
				<p class="mt-2 text-xl font-bold text-indigo-600">
					🧠 Puntaje final: {puntaje}
				</p>
			</div>

			<div class="space-y-6">
				{#each preguntas as pregunta, i (i)}
					<div
						class={`rounded-xl border-2 bg-white p-6 shadow-sm transition-all ${
							esCorrecta(i) ? 'border-green-300' : 'border-red-300'
						}`}
						in:fade={{ delay: 300 + i * 100, duration: 500 }}
					>
						<div class="flex items-start gap-3">
							<div class="mt-1 text-2xl">
								{esCorrecta(i) ? '✅' : '❌'}
							</div>
							<div class="flex-1">
								{#if pregunta.pasaje}
									<div class="mb-2 rounded border-l-4 border-blue-300 bg-blue-50 p-3 text-blue-900">
										<p class="text-base whitespace-pre-wrap">{pregunta.pasaje}</p>

									</div>
								{/if}

								{#if pregunta.formula}
									<div class="mb-2 rounded bg-gray-50 px-4 py-2">
										<MathText content={pregunta.formula} />
									</div>
								{/if}

								<h2 class="text-md mb-2 font-semibold text-gray-800">
									{i + 1}. <TextOrMath content={pregunta.enunciado} />
								</h2>

								<p class="mb-1 text-sm">
									<span class="font-medium">Tu respuesta:</span>
									<span
										class={esCorrecta(i) ? 'font-bold text-green-700' : 'font-bold text-red-700'}
									>
										{respuestasUsuario[i] || 'Sin responder'}
									</span>
								</p>

								{#if !esCorrecta(i)}
									<p class="mb-1 text-sm text-gray-700">
										✅ <strong>Respuesta correcta:</strong>
										{pregunta.respuestaCorrecta}
									</p>
								{/if}

								<p class="text-sm text-gray-600 italic">
									💡 <TextOrMath content={pregunta.explicacion} />
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-10 text-center" in:fade={{ delay: 300, duration: 500 }}>
				<button
					class="rounded-full bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
					on:click={volverResumen}
				>
					⬅️ Volver al resumen
				</button>
			</div>
		{/if}
	</div>
</div>
