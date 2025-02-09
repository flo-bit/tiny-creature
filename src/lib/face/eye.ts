import * as PIXI from 'pixi.js';
import { AnimatedProperties, AnimatedProperty, degreesToRadians } from './math-helper';

export type EyeOptions = {
	x: number;
	y: number;

	sizeX: number;
	sizeY: number;

	pupilSizeX: number;
	pupilSizeY: number;
};

export default class Eye {
	container: PIXI.Container;

	base?: PIXI.Graphics;
	pupil?: PIXI.Graphics;

	mask?: PIXI.Graphics;

	// how long one blink takes, split into four parts [close animation, closed, open animation, open]
	blinkSpeed: [number, number, number, number] = [0.05, 0.1, 0.1, 1];

	private blinkTimer: number = 0;
	private blinkState: number = 3;

	_x: AnimatedProperty;
	_y: AnimatedProperty;

	dx: number = 0;
	dy: number = 0;

	targetX: number = 0;
	targetY: number = 0;

	options: AnimatedProperties<EyeOptions>;

	furMask?: PIXI.Graphics;

	constructor(opts: Partial<EyeOptions>) {
		this.options = new AnimatedProperties({
			x: opts.x ?? 0,
			y: opts.y ?? 0,
			sizeX: opts.sizeX ?? 50,
			sizeY: opts.sizeY ?? 50,
			pupilSizeX: opts.pupilSizeX ?? (opts.sizeX ?? 50) * 0.5,
			pupilSizeY: opts.pupilSizeY ?? (opts.sizeY ?? 50) * 0.5
		});

		this.container = new PIXI.Container();

		this.container.position.set(this.options.get('x'), this.options.get('y'));

		this._x = new AnimatedProperty();
		this._y = new AnimatedProperty();

		this.base = new PIXI.Graphics();
		this.container.addChild(this.base);

		this.pupil = new PIXI.Graphics();
		this.container.addChild(this.pupil);
		this.mask = new PIXI.Graphics();
		this.container.addChild(this.mask);
		this.container.mask = this.mask;

		this.furMask = new PIXI.Graphics();
		this.furMask.blendMode = 'erase';
		this.furMask.x = this.options.get('x');
		this.furMask.y = this.options.get('y');

		this.draw();
	}

	draw() {
		if (!this.base || !this.pupil || !this.mask || !this.furMask) return;
		const sizeX = this.options.get('sizeX');
		const sizeY = this.options.get('sizeY');

		const pupilSizeX = this.options.get('pupilSizeX');
		const pupilSizeY = this.options.get('pupilSizeY');

		this.mask.clear();
		this.mask.ellipse(0, 0, sizeX, sizeY).fill(0xffffff);

		this.base.clear();
		this.base.ellipse(0, 0, sizeX, sizeY).fill(0xffffff);

		this.pupil.clear();
		this.pupil.ellipse(0, 0, pupilSizeX, pupilSizeY).fill(0x000000);
		this.pupil
			.circle(pupilSizeX * 0.5, pupilSizeY * 0.5, 0.2 * sizeX)
			.fill({ color: 0xffffff, alpha: 0.7 });

		this.furMask.clear();
		this.furMask.ellipse(0, 0, sizeX, sizeY).fill({ color: '#ffffff' });
	}

	lookInDirection(direction: number) {
		const angle = degreesToRadians(direction);

		this.lookAt(Math.cos(angle), Math.sin(angle));
	}

	lookAt(x: number, y: number) {
		this._x.set(x * this.options.get('sizeX') * 0.3);
		this._y.set(y * this.options.get('sizeY') * 0.3);
	}

	rotate(angle: number) {
		// get current angle
		const currentAngle = Math.atan2(this._y.value, this._x.value);

		const moveAngle = degreesToRadians(angle);

		this.lookAt(Math.cos(currentAngle + moveAngle), Math.sin(currentAngle + moveAngle));
	}

	update(deltaTime: number) {
		const updateX = this._x.update(deltaTime);
		const updateY = this._y.update(deltaTime);
		if (updateX || updateY) {
			this.pupil?.position.set(this._x.value, this._y.value);
		}

		if (this.options.update(deltaTime)) {
			this.container.position.set(this.options.get('x'), this.options.get('y'));

			this.furMask?.position.set(this.options.get('x'), this.options.get('y'));

			this.draw();
		}

		if (this.mask) {
			// Blink animation
			this.blinkTimer += deltaTime;

			if (this.blinkTimer >= this.blinkSpeed[this.blinkState]) {
				this.blinkTimer = 0;
				this.blinkState = (this.blinkState + 1) % 4;
			}

			let scale: number;
			switch (this.blinkState) {
				case 0: // Closing
					scale = 1 - this.blinkTimer / this.blinkSpeed[0];
					break;
				case 1: // Closed
					scale = 0;
					break;
				case 2: // Opening
					scale = this.blinkTimer / this.blinkSpeed[2];
					break;
				default: // Open
					scale = 1;
			}
			this.mask.scale.y = scale;
		}
	}
}
