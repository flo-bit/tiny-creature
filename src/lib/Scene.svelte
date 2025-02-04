<script lang="ts">
	import { T, useStage, useTask, useThrelte } from '@threlte/core';
	import Creature from './Creature.svelte';
	import {
		Environment,
		OrbitControls,
		Sky,
		TransformControls,
		VirtualEnvironment
	} from '@threlte/extras';
	import Room from './Room.svelte';
	import { DoubleSide } from 'three';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import Grass from './Grass.svelte';
	let debug = $state(false);

	const { renderer } = useThrelte();
	import Stats from 'stats.js';
	var stats = new Stats();

	onMount(() => {
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 0.4;

		stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(stats.dom);
	});

	useTask((delta) => {
		stats.begin();
	});
	const { renderStage } = useThrelte();

	const afterRenderStage = useStage('after-render', {
		after: renderStage
	});
	useTask(
		(delta) => {
			stats.end();
		},
		{ stage: afterRenderStage }
	);
</script>

<T.PerspectiveCamera makeDefault position={[5, 1, 0]}>
	<OrbitControls />
</T.PerspectiveCamera>

<Creature />

<Environment isBackground={false} url={'/tiny-creature/workshop.hdr'} />

<!-- <Grass /> -->

<!-- <Room /> -->

{#snippet lightformer(
	color: string,
	shape: 'circle' | 'plane',
	size: number,
	position: [number, number, number],
	visible: boolean
)}
	<T.Group {position}>
		{#snippet children({ ref })}
			{#if visible}
				<TransformControls object={ref} />
			{/if}
			<T.Mesh lookAt={[0, 0, 0]}>
				{#if shape === 'circle'}
					<T.CircleGeometry args={[size / 2]} />
				{:else}
					<T.PlaneGeometry args={[size, size]} />
				{/if}
				<T.MeshBasicMaterial {color} side={DoubleSide} />
			</T.Mesh>
		{/snippet}
	</T.Group>
{/snippet}

<!-- <Sky /> -->
<VirtualEnvironment visible={debug}>
	{@render lightformer('#FFfFfF', 'plane', 20, [0, 0, -20], debug)}
	{@render lightformer('#FFD0CB', 'circle', 5, [0, 5, 0], debug)}
	{@render lightformer('#2223FF', 'plane', 8, [-3, 0, 4], debug)}

	<Room />
</VirtualEnvironment>
