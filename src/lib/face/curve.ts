import * as PIXI from 'pixi.js';
import { AnimatedProperties } from './math-helper';

export type CurveOptions = {
	scale: number;
	stroke: number;
	width: number;
	curve: number;

	colorRed: number;
	colorGreen: number;
	colorBlue: number;

	x: number;
	y: number;

	angle: number;
	sharpness: number;
};

export default class Curve {
	graphics: PIXI.Graphics;

	options: AnimatedProperties<CurveOptions>;

	constructor(opts: Partial<CurveOptions>) {
		this.options = new AnimatedProperties({
			scale: opts?.scale ?? 1,
			stroke: opts?.stroke ?? 5,
			width: opts?.width ?? 50,
			curve: opts?.curve ?? 10,
			x: opts?.x ?? 0,
			y: opts?.y ?? 0,
			angle: opts?.angle ?? 0,
			sharpness: opts?.sharpness ?? 0,
			colorRed: opts?.colorRed ?? 20,
			colorGreen: opts?.colorGreen ?? 20,
			colorBlue: opts?.colorBlue ?? 20
		});
		this.graphics = new PIXI.Graphics();

		this.draw();
	}

	draw() {
		const width = this.options.get('width');
		const curve = this.options.get('curve');
		const scale = this.options.get('scale');
		const stroke = this.options.get('stroke');
		const x = this.options.get('x');
		const y = this.options.get('y');
		const angle = this.options.get('angle');
		const sharpness = this.options.get('sharpness');
		const color = new PIXI.Color({
			r: this.options.get('colorRed'),
			g: this.options.get('colorGreen'),
			b: this.options.get('colorBlue')
		});

		this.graphics.clear();
		if (sharpness > 0.5) {
			this.graphics
				.moveTo((-width / 2) * scale, 0)
				.lineTo(0, curve * scale)
				.lineTo((width / 2) * scale, 0);
		} else {
			this.graphics
				.moveTo((-width / 2) * scale, 0)
				.quadraticCurveTo(0, curve * scale, (width / 2) * scale, 0);
		}
		this.graphics.stroke({
			color: color,
			width: stroke * scale,
			cap: 'round'
		});
		this.graphics.angle = angle;
		this.graphics.position.set(x * scale, y * scale);
	}

	update(deltaTime: number) {
		const updated = this.options.update(deltaTime);
		if (updated) this.draw();
	}
}
