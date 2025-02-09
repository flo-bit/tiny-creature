<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/Scene.svelte';
	import { WebGPURenderer } from 'three/webgpu';
	import Pane from '$lib/Pane.svelte';

	import { Tween } from 'svelte/motion';
	import { fromStore } from 'svelte/store';
	import { useProgress } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { options } from '$lib/state.svelte';
	const { progress } = useProgress();
	const p = fromStore(progress);
	const tweenedProgress = Tween.of(() => p.current, {
		duration: 150
	});
	const progressWidth = $derived(100 * tweenedProgress.current);
	const progressLessThanOne = $derived(tweenedProgress.current < 1);

	let showSettings = $state(false);

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			// check if e.srcElement is text input
			if (e.srcElement instanceof HTMLInputElement) {
				return;
			}

			if (e.key === 's') {
				showSettings = !showSettings;
			}
		});
	});

	let currentEmotion = $state('base');

	function setEmotion(emotion: string) {
		currentEmotion = emotion;
		options.currentEmotion = emotion;
		options.hasChanged = true;
	}

	let emotions: Record<string, string> = {
		base: '🙂',
		scared: '😧',
		excited: '😄',
		sad: '🙁',
		angry: '😠',
		surprised: '😲'
	};
</script>

<div class="h-screen w-screen bg-gradient-to-t from-stone-950 to-stone-900/50">
	<Canvas
		createRenderer={(canvas) => {
			return new WebGPURenderer({
				canvas,
				antialias: true,
				forceWebGL: false,
				powerPreference: 'high-performance'
			});
		}}
	>
		<!-- <Studio> -->
		<Scene />
		<!-- </Studio> -->
	</Canvas>
</div>

{#if showSettings}
	<Pane />
{/if}

{#if progressLessThanOne}
	<div
		class="absolute inset-0 z-[99999] flex h-full w-full flex-col items-center justify-center bg-stone-950 px-10 text-xl font-semibold text-white"
	>
		<div class="w-full max-w-xl">
			spawning a wigglepuff...
			<div class="relative mt-4 h-2 w-full rounded-full bg-white/10">
				<div
					class="absolute inset-0 h-full rounded-full bg-white"
					style="width: {progressWidth}%"
				></div>
			</div>
		</div>
	</div>
{/if}

<div
	class="fixed bottom-2 left-0 right-0 flex w-full items-end justify-between px-2 text-sm text-white"
>
	<div>
		made by <a href="https://flo-bit.dev" target="_blank" class="font-semibold text-pink-400"
			>flo-bit</a
		>
		for
		<a
			href="https://threejs-journey.com/challenges/tamagotchi"
			target="_blank"
			class="font-semibold text-pink-400">3js journey #016</a
		>
	</div>

	<div class="flex flex-col gap-2 text-4xl sm:flex-row">
		{#each Object.keys(emotions) as emotion}
			<button
				class="text-white {currentEmotion === emotion
					? 'rounded-xl ring-2 ring-amber-400'
					: 'opacity-80'}"
				onclick={() => {
					setEmotion(emotion);
				}}>{emotions[emotion]}</button
			>
		{/each}
	</div>
</div>
