import { Application, Container, Graphics, type Renderer } from 'pixi.js';
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
	const xScale = 0.4;
	const yScale = 1.7;
	const app = new Application();

	await app.init({
		width,
		height,
		background: '#be185d'
	});

	const container = new Container();
	container.x = width * 0.5;
	container.y = height * 0.625;
	container.scale.set(xScale, yScale);
	app.stage.addChild(container);

	rightEye = new Eye({
		x: 75,
		y: 0,
		size: 50
	});

	leftEye = new Eye({
		x: -75,
		y: 0,
		size: 50
	});

	container.addChild(rightEye.container);
	container.addChild(leftEye.container);

	mouth = new Mouth({
		x: 0,
		y: -130,
		size: 50
	});
	container.addChild(mouth.container);

	return {
		app
	};
}

export async function createFurTexture({
	width = 512,
	height = 512
}: {
	width?: number;
	height?: number;
}): Promise<{ app: Application<Renderer> }> {
	const xScale = 0.4;
	const yScale = 1.45;
	const app = new Application();

	await app.init({
		width,
		height,
		backgroundAlpha: 0.0
	});

	const container = new Container();
	container.x = width * 0.5;
	container.y = height * 0.625;
	container.scale.set(xScale, yScale);
	app.stage.addChild(container);

	const background = new Graphics();
	background.rect(0, 0, width * 5, height * 5);
	background.pivot.set(width * 2.5, height * 2.5);
	background.fill({ color: '#000000' });
	container.addChild(background);

	// add circle mask
	const circleMask = new Graphics();
	circleMask.circle(0, 0, 100);
	circleMask.blendMode = 'erase';

	circleMask.fill({ color: '#ffffff' });
	container.addChild(circleMask);

	// for (let i = 0; i < 21; i++) {
	// 	// add circle
	// 	const circle = new Graphics();
	// 	circle.circle(0, 0, 3 * i + 40);
	// 	// more and more green
	// 	circle.stroke({ color: { r: 0, g: 0, b: 0, a: i / 20 }, width: 3 });
	// 	container.addChild(circle);
	// }

	const circle = new Graphics();
	circle.circle(0, 0, 100);
	circle.fill({ color: { r: 0, g: 0, b: 0, a: 0.65 } });
	container.addChild(circle);

	const eyeMaskLeft = new Graphics();
	eyeMaskLeft.circle(0, 0, 25);
	eyeMaskLeft.x = -75 / 2;
	eyeMaskLeft.y = 0;
	eyeMaskLeft.blendMode = 'erase';
	eyeMaskLeft.fill({ color: '#ffffff' });
	container.addChild(eyeMaskLeft);

	const eyeMaskRight = new Graphics();
	eyeMaskRight.circle(0, 0, 25);
	eyeMaskRight.x = 75 / 2;
	eyeMaskRight.y = 0;
	eyeMaskRight.blendMode = 'erase';
	eyeMaskRight.fill({ color: '#ffffff' });
	container.addChild(eyeMaskRight);

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
