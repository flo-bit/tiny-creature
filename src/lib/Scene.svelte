<script lang="ts">
	import { T } from '@threlte/core';
	import Creature from './Creature.svelte';
	import { Environment, OrbitControls, TransformControls, VirtualEnvironment } from '@threlte/extras';
	import Room from './Room.svelte';
	import { DoubleSide } from 'three';

	let debug = $state(false);
</script>

<T.PerspectiveCamera makeDefault position={[-10, 10, 10]}>
	<OrbitControls />
</T.PerspectiveCamera>

<Creature />

<Environment isBackground={false} url={'/tiny-creature/workshop.hdr'} />

<Room />

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
<VirtualEnvironment visible={debug}>
	{@render lightformer('#FFfFfF', 'plane', 20, [0, 0, -20], debug)}
	{@render lightformer('#FFD0CB', 'circle', 5, [0, 5, 0], debug)}
	{@render lightformer('#2223FF', 'plane', 8, [-3, 0, 4], debug)}

	<Room />
</VirtualEnvironment>
