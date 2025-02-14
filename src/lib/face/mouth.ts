import * as PIXI from 'pixi.js';
import { AnimatedProperties } from './math-helper';

export type CurveOptions = {
	scale: number;

	upperLipStroke: number;
	upperLipCurve: number;

	upperLipCx1: number;
	upperLipCy1: number;
	upperLipCx2: number;
	upperLipCy2: number;

	lowerLipStroke: number;
	lowerLipCurve: number;

	lowerLipCx1: number;
	lowerLipCy1: number;
	lowerLipCx2: number;
	lowerLipCy2: number;

	width: number;

	colorRed: number;
	colorGreen: number;
	colorBlue: number;

	x: number;
	y: number;

	angle: number;
	sharpness: number;
};

export default class Mouth {
	container: PIXI.Container;

	graphics: PIXI.Graphics;
	lips: PIXI.Graphics;
	// teeth: PIXI.Graphics;
	// teethMask: PIXI.Graphics;

	furMask: PIXI.Graphics;

	options: AnimatedProperties<CurveOptions>;

	constructor(opts: Partial<CurveOptions>) {
		this.options = new AnimatedProperties({
			scale: opts?.scale ?? 1,
			upperLipStroke: opts?.upperLipStroke ?? 5,
			upperLipCurve: opts?.upperLipCurve ?? 10,

			upperLipCx1: opts?.upperLipCx1 ?? 0,
			upperLipCy1: opts?.upperLipCy1 ?? 0,
			upperLipCx2: opts?.upperLipCx2 ?? 0,
			upperLipCy2: opts?.upperLipCy2 ?? 0,

			lowerLipStroke: opts?.lowerLipStroke ?? 5,
			lowerLipCurve: opts?.lowerLipCurve ?? 10,

			lowerLipCx1: opts?.lowerLipCx1 ?? 0,
			lowerLipCy1: opts?.lowerLipCy1 ?? 0,
			lowerLipCx2: opts?.lowerLipCx2 ?? 0,
			lowerLipCy2: opts?.lowerLipCy2 ?? 0,

			width: opts?.width ?? 50,

			x: opts?.x ?? 0,
			y: opts?.y ?? 0,
			angle: opts?.angle ?? 0,
			sharpness: opts?.sharpness ?? 0,
			colorRed: opts?.colorRed ?? 20,
			colorGreen: opts?.colorGreen ?? 20,
			colorBlue: opts?.colorBlue ?? 20
		});

		this.container = new PIXI.Container();

		this.lips = new PIXI.Graphics();
		this.container.addChild(this.lips);

		this.graphics = new PIXI.Graphics();
		this.container.addChild(this.graphics);

		// this.teethMask = new PIXI.Graphics();
		// this.teeth = new PIXI.Graphics();
		// this.teeth.addChild(this.teethMask);
		// // this.teeth.mask = this.teethMask;
		// this.container.addChild(this.teeth);
		// this.container.addChild(this.teethMask);

		this.furMask = new PIXI.Graphics();
		this.furMask.blendMode = 'erase';

		this.draw();
	}

	draw() {
		const upperLipStroke = this.options.get('upperLipStroke');

		const upperLipCx1 = this.options.get('upperLipCx1');
		const upperLipCy1 = this.options.get('upperLipCy1');
		const upperLipCx2 = this.options.get('upperLipCx2');
		const upperLipCy2 = this.options.get('upperLipCy2');

		const lowerLipStroke = this.options.get('lowerLipStroke');

		const lowerLipCx1 = this.options.get('lowerLipCx1');
		const lowerLipCy1 = this.options.get('lowerLipCy1');
		const lowerLipCx2 = this.options.get('lowerLipCx2');
		const lowerLipCy2 = this.options.get('lowerLipCy2');

		const mouthWidth = this.options.get('width');
		const scale = this.options.get('scale');
		const x = this.options.get('x');
		const y = this.options.get('y');
		const angle = this.options.get('angle');
		const color = new PIXI.Color({
			r: this.options.get('colorRed'),
			g: this.options.get('colorGreen'),
			b: this.options.get('colorBlue')
		});

		this.graphics.clear();
		this.graphics
			.moveTo((-mouthWidth / 2) * scale, 0)
			.bezierCurveTo(
				upperLipCx1 * scale,
				upperLipCy1 * scale,
				upperLipCx2 * scale,
				upperLipCy2 * scale,
				(mouthWidth / 2) * scale,
				0
			)
			.bezierCurveTo(
				lowerLipCx1 * scale,
				lowerLipCy1 * scale,
				lowerLipCx2 * scale,
				lowerLipCy2 * scale,
				-(mouthWidth / 2) * scale,
				0
			)
			.bezierCurveTo(
				upperLipCx1 * scale,
				upperLipCy1 * scale,
				upperLipCx2 * scale,
				upperLipCy2 * scale,
				(mouthWidth / 2) * scale,
				0
			)
			.bezierCurveTo(
				lowerLipCx1 * scale,
				lowerLipCy1 * scale,
				lowerLipCx2 * scale,
				lowerLipCy2 * scale,
				-(mouthWidth / 2) * scale,
				0
			);

		this.graphics.fill({
			color: 0x220000
		});

		// this.teeth.clear();
		// this.teeth
		// 	.moveTo((-mouthWidth / 2) * scale, 0)
		// 	.quadraticCurveTo(0, upperLipCurve * scale, (mouthWidth / 2) * scale, 0)
		// 	.bezierCurveTo(
		// 		mouthWidth / 2,
		// 		lowerLipCurve * scale * 0.5,
		// 		-mouthWidth / 2,
		// 		lowerLipCurve * scale * 0.5,
		// 		-(mouthWidth / 2) * scale,
		// 		0
		// 	)
		// 	.quadraticCurveTo(0, upperLipCurve * scale, (mouthWidth / 2) * scale, 0);

		// this.teethMask.clear();
		// for (let i = 0; i < 11; i++) {
		// 	// how close to center
		// 	const distanceToCenter = 1 - Math.abs(i - 5.5) / 5.5;

		// 	this.teethMask.rect(
		// 		(-mouthWidth / 2) * scale + (i * mouthWidth) / 10,
		// 		-50,
		// 		15 * distanceToCenter,
		// 		50
		// 	);
		// }
		// this.teethMask.fill({
		// 	color: 0xffffff
		// });

		// const colorStops = [0xa1a1a1, 0xffffff, 0xffffff, 0xa1a1a1];

		// const gradient = new PIXI.FillGradient(
		// 	(-mouthWidth / 2) * scale,
		// 	0,
		// 	(mouthWidth / 2) * scale,
		// 	0
		// );

		// colorStops.forEach((number, index) => {
		// 	const ratio = index / colorStops.length;

		// 	gradient.addColorStop(ratio, number);
		// });
		// this.teeth.fill(gradient);

		this.lips.clear();
		this.lips
			.moveTo((-mouthWidth / 2) * scale, 0)
			.bezierCurveTo(
				upperLipCx1 * scale,
				upperLipCy1 * scale,
				upperLipCx2 * scale,
				upperLipCy2 * scale,
				(mouthWidth / 2) * scale,
				0
			)
			.stroke({
				color: color,
				width: upperLipStroke * scale,
				cap: 'round'
			});

		this.lips
			.bezierCurveTo(
				lowerLipCx1 * scale,
				lowerLipCy1 * scale,
				lowerLipCx2 * scale,
				lowerLipCy2 * scale,
				-(mouthWidth / 2) * scale,
				0
			)
			.stroke({
				color: color,
				width: lowerLipStroke * scale,
				cap: 'round'
			});

		this.furMask.clear();
		this.furMask
			.moveTo((-mouthWidth / 2) * scale, 0)
			.bezierCurveTo(
				upperLipCx1 * scale,
				upperLipCy1 * scale,
				upperLipCx2 * scale,
				upperLipCy2 * scale,
				(mouthWidth / 2) * scale,
				0
			)
			.bezierCurveTo(
				lowerLipCx1 * scale,
				lowerLipCy1 * scale,
				lowerLipCx2 * scale,
				lowerLipCy2 * scale,
				-(mouthWidth / 2) * scale,
				0
			)
			.bezierCurveTo(
				upperLipCx1 * scale,
				upperLipCy1 * scale,
				upperLipCx2 * scale,
				upperLipCy2 * scale,
				(mouthWidth / 2) * scale,
				0
			)
			.bezierCurveTo(
				lowerLipCx1 * scale,
				lowerLipCy1 * scale,
				lowerLipCx2 * scale,
				lowerLipCy2 * scale,
				-(mouthWidth / 2) * scale,
				0
			);

		this.furMask.fill({
			color: 0xffffff
		});

		this.furMask
			.moveTo((-mouthWidth / 2) * scale, 0)
			.bezierCurveTo(
				upperLipCx1 * scale,
				upperLipCy1 * scale,
				upperLipCx2 * scale,
				upperLipCy2 * scale,
				(mouthWidth / 2) * scale,
				0
			)
			.stroke({
				color: 0xffffff,
				width: upperLipStroke * scale,
				cap: 'round'
			});

		this.furMask
			.bezierCurveTo(
				lowerLipCx1 * scale,
				lowerLipCy1 * scale,
				lowerLipCx2 * scale,
				lowerLipCy2 * scale,
				-(mouthWidth / 2) * scale,
				0
			)
			.stroke({
				color: 0xffffff,
				width: lowerLipStroke * scale,
				cap: 'round'
			});

		this.container.angle = angle;
		this.container.position.set(x * scale, y * scale);

		this.furMask.angle = angle;
		this.furMask.position.set(x * scale, y * scale);
	}

	update(deltaTime: number) {
		const updated = this.options.update(deltaTime);
		if (updated) this.draw();
	}
}
