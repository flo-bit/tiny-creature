import { Application, Container, Graphics, type Renderer } from 'pixi.js';
import Eye from './eye';
import Curve from './curve';

let leftEye: Eye;
let rightEye: Eye;

let mouth: Curve;
let furMouth: Curve;

let eyebrowLeft: Curve;
let eyebrowRight: Curve;

let background: Graphics;

const mouthSettings = {
	x: 0,
	y: -130,
	stroke: 20,
	color: 0,
	width: 100,
	curve: -40
};

const size = {
	width: 512,
	height: 512
};

export async function createFaceTexture({
	width = size.width,
	height = size.height
}: {
	width?: number;
	height?: number;
}): Promise<{ app: Application<Renderer> }> {
	size.width = width;
	size.height = height;

	const xScale = 0.4;
	const yScale = 1.5;
	const app = new Application();

	await app.init({
		width,
		height,
		background: 'black'
	});

	background = new Graphics();
	background.rect(0, 0, width, height);
	background.fill({ color: '#be185d' });
	background.alpha = 0.7;
	app.stage.addChild(background);

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

	mouth = new Curve(mouthSettings);
	container.addChild(mouth.graphics);

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
	const yScale = 1.5;
	const app = new Application();

	await app.init({
		width,
		height,
		backgroundAlpha: 0.0,
		antialias: true
	});

	const container = new Container();
	container.x = width * 0.5;
	container.y = height * 0.625;
	container.scale.set(xScale, yScale);
	app.stage.addChild(container);

	const background = new Graphics();
	background.rect(0, 0, width * 5, height * 5);
	background.pivot.set(width * 2.5, height * 2.5);
	background.fill({ color: 'black' });
	container.addChild(background);

	// draw 50 random colored circles in random positions
	// for (let i = 0; i < 500; i++) {
	// 	const circle = new Graphics();
	// 	circle.circle(0, 0, 1 + Math.random() * 20 + 10);
	// 	circle.x = (Math.random() * width * 0.8 - width * 0.4) / xScale;
	// 	circle.y = (Math.random() * height * 0.4 - height * 0.2) / yScale;

	// 	// if (Math.hypot(circle.x, circle.y) < 150) continue;

	// 	circle.fill({
	// 		color: {
	// 			r: Math.random() * 256,
	// 			g: Math.random() * 256,
	// 			b: Math.random() * 256,
	// 			a: Math.random()
	// 		}
	// 	});
	// 	container.addChild(circle);
	// }

	// add circle mask
	const circleMask = new Graphics();
	circleMask.circle(0, 0, 100);
	circleMask.blendMode = 'erase';

	circleMask.fill({ color: '#ffffff' });
	container.addChild(circleMask);

	for (let i = 0; i < 21; i++) {
		// add circle
		const circle = new Graphics();
		circle.circle(0, 0, 5 * i - 2.5);
		circle.stroke({ color: { r: 0, g: 0, b: 0, a: Math.pow(i / 21, 10) + 0.7 }, width: 5 });
		container.addChild(circle);
	}

	// const circle = new Graphics();
	// circle.circle(0, 0, 100);
	// circle.fill({ color: { r: 256, g: 256, b: 256, a: 0.65 } });
	// container.addChild(circle);

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

	eyebrowLeft = new Curve({
		x: 75 / 2,
		y: 40,
		width: 50,
		curve: 10,
		stroke: 10
	});
	eyebrowLeft.graphics.alpha = 0.5;
	container.addChild(eyebrowLeft.graphics);

	eyebrowRight = new Curve({
		x: -75 / 2,
		y: 40,
		width: 50,
		curve: 10,
		stroke: 10
	});
	eyebrowRight.graphics.alpha = 0.5;
	container.addChild(eyebrowRight.graphics);

	furMouth = new Curve({
		...mouthSettings,
		scale: 0.5
	});

	furMouth.graphics.blendMode = 'erase';
	container.addChild(furMouth.graphics);

	return {
		app
	};
}

export { leftEye, rightEye, mouth, eyebrowLeft, eyebrowRight, furMouth };

export function updateBackground(color: string) {
	background.clear();
	background.rect(0, 0, size.width, size.height);
	background.fill({ color });
}

export function updateFace(dt: number, x: number, y: number) {
	leftEye?.lookAt(x, y);
	rightEye?.lookAt(x, y);

	eyebrowLeft?.update(dt);
	eyebrowRight?.update(dt);

	mouth?.update(dt);
	furMouth?.update(dt);

	leftEye?.update(dt);
	rightEye?.update(dt);
}
