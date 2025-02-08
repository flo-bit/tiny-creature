<script lang="ts">
	import { GLTFLoader } from 'three/examples/jsm/Addons.js';
	import * as THREE from 'three/webgpu';
	// @ts-ignore
	import { WiggleBone } from 'wiggle';
	import { onMount } from 'svelte';
	import { createFaceTexture, createFurTexture, updateBackground, updateFace } from './face/face';
	import { T, useTask, useThrelte } from '@threlte/core';
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
		uniform,
		vec3,
		vec4
	} from 'three/tsl';
	import { colors } from './state.svelte';

	let rootBone: THREE.Bone;
	const wiggleBones: WiggleBone[] = [];
	let creature: THREE.Group | null = $state(null);

	let canvasTexture: THREE.CanvasTexture;
	let furTexture: THREE.CanvasTexture;

	const { canvas } = useThrelte();

	let mouse = new THREE.Vector2();

	function jump() {
		ySpeed = 5;
	}

	let primaryColors: THREE.TSL.ShaderNodeObject<THREE.UniformNode<THREE.Color>>[] = [];
	let secondaryColors: THREE.TSL.ShaderNodeObject<THREE.UniformNode<THREE.Color>>[] = [];

	onMount(async () => {
		// add mouse movement
		canvas.addEventListener('mousemove', (event) => {
			mouse.set(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
		});

		// jump on touch, click and space
		canvas.addEventListener('touchstart', (event) => {
			jump();
		});
		canvas.addEventListener('click', (event) => {
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
			const material = new THREE.MeshStandardNodeMaterial();
			material.colorNode = texture(canvasTexture);

			material.bumpMap = canvasTexture;

			mesh.material = material;

			const furMeshes = [];

			let total = 12;
			for (let i = 0; i < total; i++) {
				const material = new THREE.MeshStandardNodeMaterial();

				// move vertices along normal to make each shell slightly bigger than the last
				material.positionNode = positionGeometry
					.add(normalGeometry.mul(i * 0.01))
					// simulate some gravity
					.add(vec3(0, -0.002, 0).mul(i));

				const primaryColor = uniform(new THREE.Color(colors.primary));
				const secondaryColor = uniform(new THREE.Color(colors.secondary));

				primaryColors.push(primaryColor);
				secondaryColors.push(secondaryColor);

				material.colorNode = Fn(() => {
					const t = texture(furTexture);

					// noise color
					const c = mix(
						color(primaryColor),
						color(secondaryColor),
						mx_noise_float(positionGeometry.mul(10).mul(0.5).add(0.5))
					);
					// const c = color(0xec4899);

					// how much fur is there
          // more transparent -> less fur (0 = no fur)
					const a = t.a;

					// if fur texture is black, use noise color
					// make lower layers darker
					const s = select(t.rgb.lengthSq().lessThan(0.00001), c, t).mul(
						float(i / total)
							.add(a.mul(-1).add(1))
							.mul(0.8)
							.add(0.2)
					);

					// make more parts of the upper layers transparent
					const opacity = select(
						mx_noise_float(positionGeometry.mul(float(200).add(a.mul(-100)))).greaterThan(
							float((i / total) * 2 - 1).add(a.mul(-2).add(2))
						),
						1.0,
						0.0
					);

					return vec4(s.rgb, opacity);
				})();

				material.alphaTestNode = float(0.9);

				const fur = mesh.clone();
				fur.name = `fur-${i}`;
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

	let lastColors = {
		primary: colors.primary.toLowerCase(),
		secondary: colors.secondary.toLowerCase()
	};

	useTask((dt) => {
		total += dt;
		wiggleBones.forEach((wiggleBone) => {
			wiggleBone.update();
		});

		if (canvasTexture) {
			updateFace(dt, (mouse.x - 0.5) * 2, -(mouse.y - 0.5) * 2);
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

		if (
			lastColors.primary !== colors.primary.toLowerCase() ||
			lastColors.secondary !== colors.secondary.toLowerCase()
		) {
			updateBackground(colors.primary);

			primaryColors.forEach((primaryColor) => {
				primaryColor.value = new THREE.Color(colors.primary);
			});

			secondaryColors.forEach((secondaryColor) => {
				secondaryColor.value = new THREE.Color(colors.secondary);
			});
		}
	});
</script>

{#if creature}
	<T is={creature} />
{/if}
