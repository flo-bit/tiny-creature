<script lang="ts">
	import { T, useStage, useTask, useThrelte } from '@threlte/core';
	import { Environment, OrbitControls } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { CineonToneMapping } from 'three';
	import Stats from 'stats.js';

	import Creature from './Creature.svelte';

	const { renderer, scene } = useThrelte();

	var stats = new Stats();

	let distance = 5;

	onMount(() => {
		renderer.toneMapping = CineonToneMapping;
		scene.environmentIntensity = 0.2;

		if (window.innerWidth < 768) {
			distance = 8;
		}

		stats.showPanel(0);
		document.body.appendChild(stats.dom);

		window.addEventListener('resize', () => {
			if (window.innerWidth < 768) {
				distance = 8;
			} else {
				distance = 5;
			}
		});
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

<T.PerspectiveCamera makeDefault position={[0, 0, distance]}>
	<OrbitControls />
</T.PerspectiveCamera>

<Creature />

<Environment isBackground={false} url={'/tiny-creature/workshop.jpg'} />

<T.DirectionalLight position={[10, 10, 10]} intensity={1} />

<T.DirectionalLight position={[-10, 10, -10]} intensity={0.5} />
