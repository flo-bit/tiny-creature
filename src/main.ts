import * as THREE from "three";
// @ts-ignore
import { WiggleBone } from "wiggle";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createFaceTexture, updateFace } from "./face/face";

const setup = async () => {
  // Create the scene
  const scene = new THREE.Scene();

  const mouse = new THREE.Vector2();

  // Create the camera
  const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
  );

  // Position the camera
  camera.position.z = 3;

  // Set up the renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // set styles of the canvas
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const { app } = await createFaceTexture({
    width: 512,
    height: 512,
  });

  const texture = new THREE.CanvasTexture(app.canvas);

  const loader = new GLTFLoader();

  let rootBone: THREE.Bone;
  const wiggleBones: WiggleBone[] = [];

  loader.load("/tiny-creature/model.glb", ({ scene: obj }) => {
    const mesh = obj.getObjectByName("Icosphere");
    if (!mesh) return;

    if (mesh instanceof THREE.Mesh) {
      mesh.material = new THREE.MeshStandardMaterial({
        map: texture,
      });
    }

    if (mesh instanceof THREE.SkinnedMesh) {
      mesh.skeleton.bones.forEach((bone) => {
        if (!(bone.parent instanceof THREE.Bone) || !bone.parent?.isBone) {
          rootBone = bone;

          rootBone.rotation.y = -Math.PI / 2;
        } else {
          const wiggleBone = new WiggleBone(bone, {
            velocity: 0.4,
          });
          wiggleBones.push(wiggleBone);
        }
      });
    }

    scene.add(obj);
  });

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

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
      rootBone.position.x = mouse.x * 2;
      rootBone.position.y = mouse.y * 2;
    }

    wiggleBones.forEach((wiggleBone) => {
      wiggleBone.update();
    });

    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // get mouse position
  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
};

setup();
