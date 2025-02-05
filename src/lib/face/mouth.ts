import * as PIXI from 'pixi.js';

export type EyeOptions = {
	container: PIXI.Container;

	scale: number;

	stroke: number;

	width: number;

	curve: number;

	color: PIXI.ColorSource;

	x: number;
	y: number;
};

export default class Mouth {
	container: PIXI.Container;

	scale: number = 1;

	x: number = 0;
	y: number = 0;

	constructor(opts: Partial<EyeOptions>) {
		this.container = new PIXI.Container();

		this.scale = opts?.scale ?? 1;

		this.x = opts?.x ?? 0;
		this.y = opts?.y ?? 0;

		if (opts.container) opts.container.addChild(this.container);

		const width = opts?.width ?? 50;
		const curve = opts?.curve ?? 10;

		const eyebrow = new PIXI.Graphics()
			.moveTo((-width / 2) * this.scale, 0)
			.quadraticCurveTo(0, curve * this.scale, (width / 2) * this.scale, 0)
			.stroke({
				color: opts?.color ?? 0x101010,
				width: (opts?.stroke ?? 5) * this.scale,
				cap: 'round'
			});

		eyebrow.position.set(this.x * this.scale, this.y * this.scale);

		this.container.addChild(eyebrow);
	}
}
