<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/Scene.svelte';
	import { WebGPURenderer } from 'three/webgpu'
	import Pane from '$lib/Pane.svelte';

</script>

<div class="h-screen w-screen bg-gradient-to-t from-stone-950 to-stone-900/50">
	<Canvas createRenderer={(canvas) => {
		return new WebGPURenderer({
		  canvas,
		  antialias: true,
		  forceWebGL: false
		})
	  }}>
		<!-- <Studio> -->
			<Scene />
		<!-- </Studio> -->
	</Canvas>
</div>


<Pane />