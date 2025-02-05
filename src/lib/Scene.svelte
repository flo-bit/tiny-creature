<script lang="ts">
	import { T, useStage, useTask, useThrelte } from '@threlte/core';
	import { Environment, OrbitControls } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { ACESFilmicToneMapping } from 'three';
	import Stats from 'stats.js';

	import Creature from './Creature.svelte';

	const { renderer } = useThrelte();

	var stats = new Stats();

	onMount(() => {
		renderer.toneMapping = ACESFilmicToneMapping;
		renderer.toneMappingExposure = 0.4;

		stats.showPanel(0);
		document.body.appendChild(stats.dom);
	});


	const { renderStage } = useThrelte();

	const afterRenderStage = useStage('after-render', {
		after: renderStage
	});
	
	useTask(() => {
		stats.begin();
	});
	useTask(
		() => {
			stats.end();
		},
		{ stage: afterRenderStage }
	);
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 8]}>
	<OrbitControls />
</T.PerspectiveCamera>

<Creature />

<Environment isBackground={false} url={'/tiny-creature/workshop.hdr'} />
