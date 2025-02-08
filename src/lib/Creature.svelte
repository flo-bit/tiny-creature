<script lang="ts">
	import { GLTFLoader } from 'three/examples/jsm/Addons.js';
	import * as THREE from 'three/webgpu';
	// @ts-ignore
	import { WiggleBone } from 'wiggle';
	import { onMount } from 'svelte';
	import { createFace } from './face/face';
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
	import { options } from './state.svelte';

	let rootBone: THREE.Bone;
	const wiggleBones: WiggleBone[] = [];
	let creature: THREE.Group | null = $state(null);

	let faceTexture: THREE.CanvasTexture;
	let furTexture: THREE.CanvasTexture;

	const { canvas } = useThrelte();

	let {
		scale = [1, 1, 1],
		position = [0, 0, 0]
	}: { scale?: [number, number, number]; position?: [number, number, number] } = $props();

	let mouse = new THREE.Vector2();

	function jump() {
		ySpeed = 5;
	}

	let primaryColors: THREE.TSL.ShaderNodeObject<THREE.UniformNode<THREE.Color>>[] = [];
	let secondaryColors: THREE.TSL.ShaderNodeObject<THREE.UniformNode<THREE.Color>>[] = [];

	let face: Awaited<ReturnType<typeof createFace>>;

	async function createTextures() {
		face = await createFace({
			width: 256,
			height: 256,
			scale: 0.25
		});

		faceTexture = new THREE.CanvasTexture(face.faceCanvas);
		faceTexture.minFilter = THREE.NearestFilter;
		faceTexture.magFilter = THREE.NearestFilter;

		furTexture = new THREE.CanvasTexture(face.furCanvas);
	}

	function createFur(mesh: THREE.SkinnedMesh) {
		const furMeshes = [];

		let total = 12;
		for (let i = 0; i < total; i++) {
			const material = new THREE.MeshStandardNodeMaterial();

			// move vertices along normal to make each shell slightly bigger than the last
			material.positionNode = positionGeometry
				.add(normalGeometry.mul(i * 0.01))
				// simulate some gravity
				.add(vec3(0, -0.002, 0).mul(i));

			const primaryColor = uniform(new THREE.Color(options.colors.primary));
			const secondaryColor = uniform(new THREE.Color(options.colors.secondary));

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

		return furMeshes;
	}

	function createWiggleBones(mesh: THREE.SkinnedMesh) {
		mesh.skeleton.bones.forEach((bone) => {
			if (!(bone.parent instanceof THREE.Bone) || !bone.parent?.isBone) {
				rootBone = bone;

				rootBone.scale.set(scale[0], scale[1], scale[2]);
			} else {
				const wiggleBone = new WiggleBone(bone, {
					velocity: 0.4
				});
				wiggleBones.push(wiggleBone);
			}
		});
	}

	function addEventListeners() {
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
	}

	onMount(async () => {
		addEventListeners();

		let texturePromise = createTextures();

		const loader = new GLTFLoader();

		loader.load('/tiny-creature/model.glb', async ({ scene: obj }) => {
			const mesh = obj.getObjectByName('Icosphere');
			if (!(mesh instanceof THREE.SkinnedMesh)) return;

      await texturePromise;

			creature = obj;

			mesh.material = new THREE.MeshStandardMaterial({ map: faceTexture });

			let fur = createFur(mesh);
			obj.add(...fur);

			createWiggleBones(mesh);
		});
	});

	let total = 0;
	let ySpeed = 0;

	useTask((dt) => {
		total += dt;
		wiggleBones.forEach((wiggleBone) => {
			wiggleBone.update();
		});

		if (rootBone) {
			rootBone.position.x = (Math.sin(total * 2) * 0.5 + position[0]);

			rootBone.position.y += ySpeed * dt;
			rootBone.position.y = Math.max(rootBone.position.y, -1) + position[1];
			rootBone.position.z = position[2];

			ySpeed -= 10 * dt;
		}

		if (!face) return;

		face.update(dt);
		face.lookAt((mouse.x - 0.5) * 2, -(mouse.y - 0.5) * 2);

		faceTexture.needsUpdate = true;
		furTexture.needsUpdate = true;

		faceTexture.needsUpdate = true;

		if (options.hasChanged) {
			console.log('updating creature');

			face.eyebrowLeft.options.set('curve', options.leftEyebrow.curve);
			face.eyebrowLeft.options.set('stroke', options.leftEyebrow.stroke);
			face.eyebrowLeft.options.set('width', options.leftEyebrow.width);
			face.eyebrowLeft.options.set('x', options.leftEyebrow.x);
			face.eyebrowLeft.options.set('y', options.leftEyebrow.y);
			face.eyebrowLeft.options.set('angle', options.leftEyebrow.angle);

			face.eyebrowRight.options.set('curve', options.rightEyebrow.curve);
			face.eyebrowRight.options.set('stroke', options.rightEyebrow.stroke);
			face.eyebrowRight.options.set('width', options.rightEyebrow.width);
			face.eyebrowRight.options.set('x', options.rightEyebrow.x);
			face.eyebrowRight.options.set('y', options.rightEyebrow.y);
			face.eyebrowRight.options.set('angle', options.rightEyebrow.angle);

			face.mouth.options.set('curve', options.mouth.curve);
			face.mouth.options.set('stroke', options.mouth.stroke);
			face.mouth.options.set('width', options.mouth.width);
			face.mouth.options.set('x', options.mouth.x);
			face.mouth.options.set('y', options.mouth.y);

			face.furMouth.options.set('curve', options.mouth.curve);
			face.furMouth.options.set('stroke', options.mouth.stroke);
			face.furMouth.options.set('width', options.mouth.width);
			face.furMouth.options.set('x', options.mouth.x);
			face.furMouth.options.set('y', options.mouth.y);

			face.updateBackground(options.colors.primary);

			primaryColors.forEach((primaryColor) => {
				primaryColor.value = new THREE.Color(options.colors.primary);
			});

			secondaryColors.forEach((secondaryColor) => {
				secondaryColor.value = new THREE.Color(options.colors.secondary);
			});

			options.hasChanged = false;
		}
	});
</script>

{#if creature}
	<T is={creature} />
{/if}
