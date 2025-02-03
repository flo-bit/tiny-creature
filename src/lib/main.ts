import * as THREE from 'three';
// @ts-ignore
import { WiggleBone } from 'wiggle';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createFaceTexture, updateFace } from './face/face';

const setup = async () => {
	// Create the scene
	const scene = new THREE.Scene();

	const mouse = new THREE.Vector2();

	// // Create the camera
	// const camera = new THREE.PerspectiveCamera(
	//   75, // Field of view
	//   window.innerWidth / window.innerHeight, // Aspect ratio
	// );

	// // Position the camera
	// camera.position.z = 7;
	// camera.position.y = 7;
	// camera.position.x = -7;

	const s = 7;
	const width = window.innerWidth * 0.015;
	const height = window.innerHeight * 0.015;
	const camera = new THREE.OrthographicCamera(
		width / -2,
		width / 2,
		height / 2,
		height / -2,
		0.1,
		100
	);
	camera.position.z = 7;
	camera.position.y = 7;
	camera.position.x = -7;

	// look at the origin
	camera.lookAt(0, 0, 0);

	// Set up the renderer
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// set styles of the canvas
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '0';
	renderer.domElement.style.left = '0';
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';

	renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing
	renderer.toneMapping = THREE.ACESFilmicToneMapping;

	const { app } = await createFaceTexture({
		width: 512,
		height: 512
	});

	const texture = new THREE.CanvasTexture(app.canvas);

	const loader = new GLTFLoader();

	let rootBone: THREE.Bone;
	const wiggleBones: WiggleBone[] = [];

	let creature: THREE.Group;

	loader.load('/tiny-creature/model.glb', ({ scene: obj }) => {
		const mesh = obj.getObjectByName('Icosphere');
		if (!mesh) return;

		creature = obj;

		if (mesh instanceof THREE.Mesh) {
			mesh.material = new THREE.MeshStandardMaterial({
				map: texture
			});
		}

		// obj.rotation.y = -Math.PI / 2;
		obj.lookAt(camera.position);

		if (mesh instanceof THREE.SkinnedMesh) {
			mesh.skeleton.bones.forEach((bone) => {
				if (!(bone.parent instanceof THREE.Bone) || !bone.parent?.isBone) {
					rootBone = bone;

					// rootBone.rotation.x = Math.PI / 2;
				} else {
					const wiggleBone = new WiggleBone(bone, {
						velocity: 0.4
					});
					wiggleBones.push(wiggleBone);
				}
			});
		}

		scene.add(obj);
	});

	loader.load('/tiny-creature/room.glb', ({ scene: obj }) => {
		scene.add(obj);
		console.log(obj);
		// find mesh named Cube
		const mesh = obj.getObjectByName('Cube');
		if (mesh instanceof THREE.Mesh) {
			mesh.material = new THREE.MeshStandardMaterial({
				color: 0xb1b1b1,
				side: THREE.DoubleSide
			});
		}

		// find Light object
		const light = obj.getObjectByName('Light');
		// add light there
		if (light) {
			const pointLight = new THREE.PointLight(0xffffff, 0.7);
			pointLight.position.copy(light.position);
			scene.add(pointLight);
		}

		// find Light object
		const light2 = obj.getObjectByName('Light2');
		if (light2) {
			const pointLight = new THREE.PointLight(0xffffff, 0.4);
			pointLight.position.copy(light2.position);
			scene.add(pointLight);
		}
	});

	const light = new THREE.DirectionalLight(0xffffff, 0.2);
	light.position.set(10, 10, 10);
	scene.add(light);

	const light2 = new THREE.DirectionalLight(0xffffff, 0.1);
	light2.position.set(-10, 10, -10);
	scene.add(light2);

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	let lastTime = performance.now();
	const animate = () => {
		requestAnimationFrame(animate);
		texture.needsUpdate = true;

		const deltaTime = (performance.now() - lastTime) / 1000;
		lastTime = performance.now();

		updateFace(deltaTime, mouse.x, mouse.y);

		if (rootBone) {
			creature.position.z = -mouse.x * 2;
			creature.position.x = mouse.y * 2;
			creature.position.y = 0.5;

			// look at camera
			creature.lookAt(new THREE.Vector3(camera.position.x, 0, camera.position.z));
			rootBone.rotation.y = -Math.PI / 2;
		}

		wiggleBones.forEach((wiggleBone) => {
			wiggleBone.update();
		});

		renderer.render(scene, camera);
	};

	animate();
};

setup();
