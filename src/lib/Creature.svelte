<script lang="ts">
	import { GLTFLoader } from 'three/examples/jsm/Addons.js';
	import * as THREE from 'three/webgpu';
	// @ts-ignore
	import { WiggleBone } from 'wiggle';
	import { onMount } from 'svelte';
	import { createFaceTexture, createFurTexture, updateFace } from './face/face';
	import { T, useTask } from '@threlte/core';

	let rootBone: THREE.Bone;
	const wiggleBones: WiggleBone[] = [];
	let creature: THREE.Group;

	let canvasTexture: THREE.CanvasTexture;
	let furTexture: THREE.CanvasTexture;

	import {
		color,
		float,
		Fn,
		mix,
		mx_noise_float,
		normalGeometry,
		positionGeometry,
		select,
		texture,
		vec3
	} from 'three/tsl';

	function jump() {
		ySpeed = 5;
	}

	onMount(async () => {
		// jump on touch, click and space
		window.addEventListener('touchstart', (event) => {
			jump();
		});
		window.addEventListener('click', (event) => {
			jump();
		});
		window.addEventListener('keydown', (event) => {
			if (event.key === ' ') {
				jump();
			}
		});

		const { app } = await createFaceTexture({
			width: 1024,
			height: 1024
		});

		canvasTexture = new THREE.CanvasTexture(app.canvas);

		const fur = await createFurTexture({
			width: 512,
			height: 512
		});

		furTexture = new THREE.CanvasTexture(fur.app.canvas);

		const loader = new GLTFLoader();

		loader.load('/tiny-creature/model.glb', ({ scene: obj }) => {
			console.log(obj);
			const mesh = obj.getObjectByName('Icosphere');
			if (!mesh) return;

			creature = obj;
			let scale = 1.4;
			creature.scale.set(scale, scale, scale);

			if (!(mesh instanceof THREE.SkinnedMesh)) return;

			// add face and fur
			const material = new THREE.MeshStandardNodeMaterial({
				roughness: 0.5
			});
			material.colorNode = texture(canvasTexture);

			material.bumpMap = canvasTexture;

			mesh.material = material;

			const furMeshes = [];

			let total = 16;
			for (let i = 0; i < total; i++) {
				const material = new THREE.MeshStandardNodeMaterial({
					transparent: true,
					opacity: 1,
					side: THREE.DoubleSide
				});

				material.positionNode = positionGeometry
					.add(normalGeometry.mul(i * 0.007))
					.add(vec3(0, -0.002, 0).mul(i));

				material.colorNode = Fn(() => {
					const t = texture(furTexture).toVar();

					const c = mix(
						color(0xec4899),
						color(0xfb923c),
						mx_noise_float(positionGeometry.mul(10).mul(0.5).add(0.5))
					);

					const s = select(t.g.lessThan(0.01).and(t.b.lessThan(0.01)), c, t.rgb);

					return s.mul(
						float(i / total)
							.add(t.a.mul(-1).add(1))
							.mul(0.8)
							.add(0.2)
					);
				})();

				material.alphaTestNode = float(0.5);

				material.opacityNode = Fn(() => {
					const t = texture(furTexture).toVar();

					return select(
						mx_noise_float(positionGeometry.mul(float(200).add(t.a.mul(-100)))).greaterThan(
							float((i / total) * 2 - 1).add(t.a.mul(-2).add(2))
						),
						1.0,
						0.0
					);
				})();

				const fur = mesh.clone();
				fur.material = material;

				furMeshes.push(fur);
			}

			mesh.add(...furMeshes);

			// add wiggle bones
			mesh.skeleton.bones.forEach((bone) => {
				if (!(bone.parent instanceof THREE.Bone) || !bone.parent?.isBone) {
					rootBone = bone;
				} else {
					const wiggleBone = new WiggleBone(bone, {
						velocity: 0.4
					});
					wiggleBones.push(wiggleBone);
				}
			});
		});
	});

	let total = 0;

	let ySpeed = 0;

	useTask((dt) => {
		total += dt;
		wiggleBones.forEach((wiggleBone) => {
			wiggleBone.update();
		});

		if (canvasTexture) {
			updateFace(dt, 0, 0);
			canvasTexture.needsUpdate = true;
		}

		if (furTexture) {
			furTexture.needsUpdate = true;
		}

		if (rootBone) {
			rootBone.position.x = Math.sin(total * 2) * 0.5;

			rootBone.position.y += ySpeed * dt;
			rootBone.position.y = Math.max(rootBone.position.y, -1);

			ySpeed -= 10 * dt;
		}
	});
</script>

{#if creature}
	<T is={creature} />
{/if}
