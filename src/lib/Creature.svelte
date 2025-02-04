<script lang="ts">
	import { GLTFLoader } from 'three/examples/jsm/Addons.js';
	import * as THREE from 'three/webgpu';
	// @ts-ignore
	import { WiggleBone } from 'wiggle';
	import { onMount } from 'svelte';
	import { createFaceTexture, updateFace } from './face/face';
	import { T, useTask, useThrelte } from '@threlte/core';

	let rootBone: THREE.Bone;
	const wiggleBones: WiggleBone[] = [];
	let creature: THREE.Group;

	let canvasTexture: THREE.CanvasTexture;
	import {
		color,
		float,
		Fn,
		If,
		mx_noise_float,
		normalGeometry,
		normalLocal,
		normalView,
		oscSine,
		positionGeometry,
		positionLocal,
		select,
		texture,
		uniform,
		uv,
		vec3
	} from 'three/tsl';

	const uniforms = [];

	const mouse = new THREE.Vector2();

	onMount(async () => {
		// add mouse movement
		window.addEventListener('mousemove', (event) => {
			// set to be between 0 and 1
			mouse.set(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
		});

		const { app } = await createFaceTexture({
			width: 1024,
			height: 1024
		});

		canvasTexture = new THREE.CanvasTexture(app.canvas);

		const loader = new GLTFLoader();

		loader.load('/tiny-creature/model.glb', ({ scene: obj }) => {
			const mesh = obj.getObjectByName('Icosphere');
			if (!mesh) return;

			creature = obj;
			let scale = 1.4;
			creature.scale.set(scale, scale, scale);

			if (mesh instanceof THREE.Mesh) {
				// mesh.material = new THREE.MeshStandardMaterial({
				// 	map: canvasTexture,
				// });

				// const detail = texture( canvasTexture, uv().mul( 10 ) );

				const material = new THREE.MeshStandardNodeMaterial();
				// material.colorNode = positionGeometry.sub(positionLocal); //texture(canvasTexture);
				// material.colorNode = color( 0x0066ff );
				material.colorNode = texture(canvasTexture);

				// const limitPosition = Fn(({ position }) => {
				// 	const limit = oscSine();

				// 	// Convert to variable using `.toVar()` to be able to use assignments.
				// 	const result = position.toVec3().toVar();

				// 	result.y = select( result.y.greaterThan( limit ), limit, result.y );

				// 	return result;
				// });

				// material.positionNode = limitPosition({ position: positionLocal });

				mesh.material = material;

				const nodes = [];

				let total = 16;
				for (let i = 0; i < total; i++) {
					const material = new THREE.MeshStandardNodeMaterial({
						transparent: true,
						opacity: 1,
						side: THREE.DoubleSide
					});

					const movement = uniform(vec3(0, 0, 0));

					uniforms.push(movement);

					material.positionNode = positionGeometry
						.add(normalGeometry.mul(i * 0.003))
						.add(movement.add(vec3(0, -0.001, 0)).mul(i * 1));

					material.colorNode = color(0xffffff).mul((i / total) * 0.8 + 0.2);

					material.alphaTestNode = float(0.5);

					material.opacityNode = select(
						texture(canvasTexture).g.greaterThan(0.8).and(texture(canvasTexture).b.lessThan(0.5)),

						select(
							mx_noise_float(positionGeometry.mul(200)).greaterThan((i / total) * 2 - 1),
							1.0,
							0.0
						),
						0.0
					);

					const grass = mesh.clone();
					grass.material = material;

					// grass.position.y = i * 0.01;
					nodes.push(grass);
				}

				mesh.add(...nodes);
			}

			// obj.rotation.y = -Math.PI / 2;
			// obj.lookAt(camera.position);

			if (mesh instanceof THREE.SkinnedMesh) {
				mesh.skeleton.bones.forEach((bone) => {
					if (!(bone.parent instanceof THREE.Bone) || !bone.parent?.isBone) {
						rootBone = bone;

						// rootBone.rotation.y = -Math.PI / 2;
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

	let lastPosition = new THREE.Vector3();
	let total = 0;
	useTask((dt) => {
		total += dt;
		wiggleBones.forEach((wiggleBone) => {
			wiggleBone.update();
		});

		if (canvasTexture) {
			updateFace(dt, 0, 0);
			canvasTexture.needsUpdate = true;
		}

		if (rootBone) {
			rootBone.position.z = Math.sin(total * 2) * 0.5; //-(mouse.x - 0.5) * 0.8 + rootBone.position.z * 0.2;

			// uniforms.forEach((uniform) => {
			// 	uniform.value.set(
			// 		(lastPosition.x - rootBone.position.x) * dt,
			// 		(lastPosition.y - rootBone.position.y) * dt,
			// 		(lastPosition.z - rootBone.position.z) * dt
			// 	);
			// });

			// console.log(
			// 	(lastPosition.x - rootBone.position.x) * dt,
			// 	(lastPosition.y - rootBone.position.y) * dt,
			// 	(lastPosition.z - rootBone.position.z) * dt
			// );

			lastPosition.copy(rootBone.position);
		}
	});
</script>

{#if creature}
	<T is={creature} />
{/if}
