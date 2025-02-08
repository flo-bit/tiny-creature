import { Application, Container, Graphics } from 'pixi.js';
import Eye from './eye';
import Curve from './curve';

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
	mouth: Curve;
	eyebrowLeft: Curve;
	eyebrowRight: Curve;
	furMouth: Curve;
}> {
	const xScale = 0.4 * scale;
	const yScale = 1.5 * scale;
	const faceApp = new Application();

	const mouthSettings = {
		x: 0,
		y: -130,
		stroke: 20,
		color: 0,
		width: 100,
		curve: -40
	};

	await faceApp.init({
		width,
		height,
		background: 'black'
	});

	const background = new Graphics();
	background.rect(0, 0, width, height);
	background.fill({ color: '#be185d' });
	background.alpha = 0.7;
	faceApp.stage.addChild(background);

	const container = new Container();
	container.x = width * 0.5;
	container.y = height * 0.625;
	container.scale.set(xScale, yScale);
	faceApp.stage.addChild(container);

	const rightEye = new Eye({
		x: 75,
		y: 0,
		size: 50
	});

	const leftEye = new Eye({
		x: -75,
		y: 0,
		size: 50
	});

	container.addChild(rightEye.container);
	container.addChild(leftEye.container);

	const mouth = new Curve(mouthSettings);
	container.addChild(mouth.graphics);

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

	const eyeMaskLeft = new Graphics();
	eyeMaskLeft.circle(0, 0, 50);
	eyeMaskLeft.x = -75;
	eyeMaskLeft.y = 0;
	eyeMaskLeft.blendMode = 'erase';
	eyeMaskLeft.fill({ color: '#ffffff' });
	furContainer.addChild(eyeMaskLeft);

	const eyeMaskRight = new Graphics();
	eyeMaskRight.circle(0, 0, 50);
	eyeMaskRight.x = 75;
	eyeMaskRight.y = 0;
	eyeMaskRight.blendMode = 'erase';
	eyeMaskRight.fill({ color: '#ffffff' });
	furContainer.addChild(eyeMaskRight);

	const eyebrowLeft = new Curve({
		x: 75,
		y: 80,
		width: 100,
		curve: 20,
		stroke: 10
	});
	eyebrowLeft.graphics.alpha = 0.5;
	furContainer.addChild(eyebrowLeft.graphics);

	const eyebrowRight = new Curve({
		x: -75,
		y: 80,
		width: 100,
		curve: 20,
		stroke: 10
	});
	eyebrowRight.graphics.alpha = 0.5;
	furContainer.addChild(eyebrowRight.graphics);

	const furMouth = new Curve({
		...mouthSettings
	});

	furMouth.graphics.blendMode = 'erase';
	furContainer.addChild(furMouth.graphics);

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
			furMouth.update(dt);

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
		eyebrowRight,
		furMouth
	};
}
