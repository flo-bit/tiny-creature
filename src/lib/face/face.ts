import { Application, Color, Container, Graphics } from 'pixi.js';
import Eye from './eye';
import Curve from './curve';
import { options } from '$lib/state.svelte';
import Mouth from './mouth';

export async function createFace({
	width = 512,
	height = 512,
	scale = 1
}: {
	width?: number;
	height?: number;
	scale?: number;
}): Promise<{
	faceCanvas: HTMLCanvasElement;
	furCanvas: HTMLCanvasElement;
	lookAt: (x: number, y: number) => void;
	update: (dt: number) => void;
	updateBackground: (color: string, alpha?: number) => void;
	leftEye: Eye;
	rightEye: Eye;
	mouth: Mouth;
	eyebrowLeft: Curve;
	eyebrowRight: Curve;
}> {
	const xScale = 0.45 * scale;
	const yScale = 1.5 * scale;
	const faceApp = new Application();

	await faceApp.init({
		width,
		height,
		background: 'black'
	});

	// add to dom
	document.body.appendChild(faceApp.canvas);
	// set to fixed position
	faceApp.canvas.style.position = 'fixed';
	faceApp.canvas.style.top = '0';
	faceApp.canvas.style.left = '0';
	faceApp.canvas.style.width = '100%';
	faceApp.canvas.style.height = '100%';

	faceApp.canvas.style.display = 'none';

	// set y scale of dom to -1
	faceApp.canvas.style.transform = 'scaleY(-1)';

	// show hide with key c
	let visible = false;
	window.addEventListener('keydown', (e) => {
		if (e.key === 'c') {
			visible = !visible;
			faceApp.canvas.style.display = visible ? 'block' : 'none';
		}
	});

	const background = new Graphics();
	background.rect(0, 0, width, height);
	background.fill({ color: '#be185d' });
	background.alpha = 0.5;
	faceApp.stage.addChild(background);

	const container = new Container();
	container.x = width * 0.5;
	container.y = height * 0.625;
	container.scale.set(xScale, yScale);
	faceApp.stage.addChild(container);

	const rightEye = new Eye(options.rightEye);

	const leftEye = new Eye(options.leftEye);

	container.addChild(rightEye.container);
	container.addChild(leftEye.container);

	const mouthColor = new Color(options.mouth.color);
	const mouth = new Mouth({
		...options.mouth,
		colorRed: mouthColor.red * 256,
		colorGreen: mouthColor.green * 256,
		colorBlue: mouthColor.blue * 256
	});
	container.addChild(mouth.container);

	const furApp = new Application();

	await furApp.init({
		width: width,
		height: height,
		backgroundAlpha: 0.0
	});

	const furContainer = new Container();
	furContainer.x = width * 0.5;
	furContainer.y = height * 0.625;
	furContainer.scale.set(xScale, yScale);
	furApp.stage.addChild(furContainer);

	const furBackground = new Graphics();
	furBackground.rect(0, 0, width / xScale, (height / yScale) * 2);
	furBackground.pivot.set(width / xScale / 2, height / yScale);
	furBackground.fill({ color: 'black' });
	furContainer.addChild(furBackground);

	// add circle mask
	const circleMask = new Graphics();
	circleMask.circle(0, 0, 100);
	circleMask.blendMode = 'erase';

	circleMask.fill({ color: '#ffffff' });
	furContainer.addChild(circleMask);

	for (let i = 0; i < 21; i++) {
		const circle = new Graphics();
		circle.circle(0, 0, 5 * i - 2.5);
		circle.stroke({ color: { r: 0, g: 0, b: 0, a: Math.pow(i / 21, 10) + 0.7 }, width: 5 });
		furContainer.addChild(circle);
	}

	if (leftEye.furMask && rightEye.furMask) {
		furContainer.addChild(leftEye.furMask);
		furContainer.addChild(rightEye.furMask);
	}

	const eyebrowLeft = new Curve(options.leftEyebrow);
	eyebrowLeft.graphics.alpha = 0.5;
	furContainer.addChild(eyebrowLeft.graphics);

	const eyebrowRight = new Curve(options.rightEyebrow);
	eyebrowRight.graphics.alpha = 0.5;
	furContainer.addChild(eyebrowRight.graphics);

	furContainer.addChild(mouth.furMask);

	return {
		faceCanvas: faceApp.canvas,
		furCanvas: furApp.canvas,
		lookAt: (x: number, y: number) => {
			leftEye?.lookAt(x, y);
			rightEye?.lookAt(x, y);
		},
		update: (dt: number) => {
			eyebrowLeft.update(dt);
			eyebrowRight.update(dt);

			mouth.update(dt);

			leftEye.update(dt);
			rightEye.update(dt);
		},
		updateBackground: (color: string, alpha: number | undefined = undefined) => {
			background.clear();
			background.rect(0, 0, width, height);
			background.fill({ color });
			if (alpha) {
				background.alpha = alpha;
			}
		},
		leftEye,
		rightEye,
		mouth,
		eyebrowLeft,
		eyebrowRight
	};
}
