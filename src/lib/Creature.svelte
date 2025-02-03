<script lang="ts">
	import { GLTFLoader } from 'three/examples/jsm/Addons.js';
	import * as THREE from 'three';
	// @ts-ignore
	import { WiggleBone } from 'wiggle';
	import { onMount } from 'svelte';
	import { createFaceTexture, updateFace } from './face/face';
	import { T, useTask, useThrelte } from '@threlte/core';

	const { scene } = useThrelte();

	let rootBone: THREE.Bone;
	const wiggleBones: WiggleBone[] = [];
	let creature: THREE.Group;

	let texture: THREE.CanvasTexture;

	onMount(async () => {
		const { app } = await createFaceTexture({
			width: 512,
			height: 512
		});

		texture = new THREE.CanvasTexture(app.canvas);

		const loader = new GLTFLoader();

		loader.load('/tiny-creature/model.glb', ({ scene: obj }) => {
			const mesh = obj.getObjectByName('Icosphere');
			if (!mesh) return;

			creature = obj;

			creature.position.y = 0.5;

			if (mesh instanceof THREE.Mesh) {
				mesh.material = new THREE.MeshStandardMaterial({
					map: texture,
				});
			}

			// obj.rotation.y = -Math.PI / 2;
			// obj.lookAt(camera.position);

			if (mesh instanceof THREE.SkinnedMesh) {
				
				mesh.skeleton.bones.forEach((bone) => {
					if (!(bone.parent instanceof THREE.Bone) || !bone.parent?.isBone) {
						rootBone = bone;

						rootBone.rotation.y = -Math.PI / 2;
					} else {
						const wiggleBone = new WiggleBone(bone, {
							velocity: 0.4
						});
						wiggleBones.push(wiggleBone);
					}
				});
			}
		});
	});

	let total = 0;
	useTask((dt) => {
		total += dt;
		wiggleBones.forEach((wiggleBone) => {
			wiggleBone.update();
		});

		if (texture) {
			updateFace(dt, 0, 0);
			texture.needsUpdate = true;
		}

		if (rootBone) rootBone.position.x = Math.sin(total * 5) * 0.5;
	});
</script>


<T is={creature} />