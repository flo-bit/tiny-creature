<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/Scene.svelte';
	import { Studio } from '@threlte/studio';
	import { WebGPURenderer } from 'three/webgpu'
	import { PerfMonitor } from '@threlte/extras';

</script>

<div class="h-screen w-screen">
	<Canvas   createRenderer={(canvas) => {
		return new WebGPURenderer({
		  canvas,
		  antialias: true,
		  forceWebGL: false
		})
	  }}>
		<Studio>
			<Scene />
		</Studio>
	</Canvas>
</div>
