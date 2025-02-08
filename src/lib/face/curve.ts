import * as PIXI from 'pixi.js';
import { AnimatedProperties } from './math-helper';

export type CurveOptions = {
	scale: number;
	stroke: number;
	width: number;
	curve: number;

	color: PIXI.ColorSource;

	x: number;
	y: number;

	angle: number;
};

export default class Curve {
	graphics: PIXI.Graphics;

	color: PIXI.ColorSource = 0x515151;

	options: AnimatedProperties<Omit<CurveOptions, 'color'>>;

	constructor(opts: Partial<CurveOptions>) {
		this.options = new AnimatedProperties({
			scale: opts?.scale ?? 1,
			stroke: opts?.stroke ?? 5,
			width: opts?.width ?? 50,
			curve: opts?.curve ?? 10,
			x: opts?.x ?? 0,
			y: opts?.y ?? 0,
			angle: opts?.angle ?? 0
		});
		this.graphics = new PIXI.Graphics();
		this.color = opts?.color ?? 0x212121;

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

		this.graphics.clear();
		this.graphics
			.moveTo((-width / 2) * scale, 0)
			.quadraticCurveTo(0, curve * scale, (width / 2) * scale, 0, -10)
			.stroke({
				color: this.color,
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
