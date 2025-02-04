<script lang="ts">
	import { GLTFLoader } from 'three/examples/jsm/Addons.js';
	import * as THREE from 'three/webgpu';

	import { onMount } from 'svelte';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { Fn, If, normalView, oscSine, positionGeometry, positionLocal, select, texture, uv, mx_noise_float, color, normalLocal } from 'three/tsl';


	const nodes = [];

	let total = 32;
	for(let i = 0; i < total; i++) {
	const material = new THREE.MeshBasicNodeMaterial({transparent: true, opacity: 1});
	const geometry = new THREE.PlaneGeometry(10, 10);

	material.positionNode = positionLocal.add(normalLocal.mul(i * 0.01));

	material.colorNode = color(0.2, 0.8, 0.2).mul((i / total) * 0.8 + 0.2);

	material.opacityNode = select( mx_noise_float(uv().mul(500)).greaterThan( (i / total) * 2 - 1 ), 1.0, 0.0 ); 

	const grass = new THREE.Mesh(geometry, material);

		grass.rotation.x = -Math.PI / 2;
		// grass.position.y = i * 0.01;
		nodes.push(grass);
	}

</script>

{#each nodes as node}
<T is={node} />
{/each}