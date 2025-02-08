<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/Scene.svelte';
	import { WebGPURenderer } from 'three/webgpu';
	import Pane from '$lib/Pane.svelte';

	import { Tween } from 'svelte/motion';
	import { fromStore } from 'svelte/store';
	import { useProgress } from '@threlte/extras';
	const { progress } = useProgress();
	const p = fromStore(progress);
	const tweenedProgress = Tween.of(() => p.current, {
		duration: 150
	});
	const progressWidth = $derived(100 * tweenedProgress.current);
	const progressLessThanOne = $derived(tweenedProgress.current < 1);
</script>

<div class="h-screen w-screen bg-gradient-to-t from-stone-950 to-stone-900/50">
	<Canvas
		createRenderer={(canvas) => {
			return new WebGPURenderer({
				canvas,
				antialias: true,
				forceWebGL: false
			});
		}}
	>
		<!-- <Studio> -->
		<Scene />
		<!-- </Studio> -->
	</Canvas>
</div>

<Pane />

{#if progressLessThanOne}
	<div class="absolute inset-0 w-full h-full flex items-center justify-start px-10 bg-stone-950">
		<div class="h-10 bg-white rounded-full" style="width: {progressWidth}%"></div>
	</div>
{/if}
