import { Application, Graphics, type Renderer } from 'pixi.js';
import Eye from './eye';
import Mouth from './mouth';

let leftEye: Eye;
let rightEye: Eye;

let mouth: Mouth;

export async function createFaceTexture({
	width = 512,
	height = 512
}: {
	width?: number;
	height?: number;
}): Promise<{ app: Application<Renderer> }> {
	const scale = 1.6;
	const app = new Application();

	await app.init({
		width,
		height,
		background: '#ffff00'
	});

	// add face circle
	const face = new Graphics();
	face.circle(0, 0, 140 * scale);
	face.x = width * 0.5;
	face.y = height * 0.5 + 30 * scale;
	face.fill({ color: '#db2777' });
	app.stage.addChild(face);

	rightEye = new Eye({
		x: width * 0.5 + 75 * scale,
		y: height * 0.5 + 50 * scale,
		size: 50 * scale
	});

	leftEye = new Eye({
		x: width * 0.5 - 75 * scale,
		y: height * 0.5 + 50 * scale,
		size: 50 * scale
	});

	app.stage.addChild(rightEye.container);
	app.stage.addChild(leftEye.container);

	mouth = new Mouth({
		x: width * 0.5,
		y: height * 0.5 - 70 * scale,
		size: 50 * scale
	});
	app.stage.addChild(mouth.container);

	return {
		app
	};
}

export function updateFace(dt: number, x: number, y: number) {
	leftEye?.lookAt(x, y);
	rightEye?.lookAt(x, y);

	leftEye?.update(dt);
	rightEye?.update(dt);
}
