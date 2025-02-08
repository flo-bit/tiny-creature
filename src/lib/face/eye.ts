import * as PIXI from "pixi.js";
import { AnimatedProperty, degreesToRadians } from './math-helper';

export type EyeOptions = {
  container: PIXI.Container;

  x: number;
  y: number;

  eyeColor: PIXI.ColorSource;
  pupilColor: PIXI.ColorSource;
  highlightColor: PIXI.ColorSource;

  size: number;

  eyebrow: Partial<{
    length: number;

    width: number;

    y: number;
    x: number;

    curve: number;

    color: PIXI.ColorSource;
  }>;

  blinkStart: number;
  blinkTimer: number;
};

export default class Eye {
	eyeContainer: PIXI.Container;

	container: PIXI.Container;

	base?: PIXI.Graphics;
	pupil?: PIXI.Graphics;
	highlight?: PIXI.Sprite;

	mask?: PIXI.Graphics;

	// how long one blink takes, split into four parts [close animation, closed, open animation, open]
	blinkSpeed: [number, number, number, number] = [0.05, 0.1, 0.1, 1];

	private blinkTimer: number = 0;
	private blinkState: number = 3;

	_x: AnimatedProperty;
	_y: AnimatedProperty;

	dx: number = 0;
	dy: number = 0;

	size: number = 1;

	targetX: number = 0;
	targetY: number = 0;

	constructor(opts: Partial<EyeOptions>) {
		this.container = new PIXI.Container();

		this.eyeContainer = new PIXI.Container();

		this.container.position.set(opts.x ?? 0, opts.y ?? 0);

		this.size = opts.size ?? 1;

		if (opts.blinkStart) {
			this.blinkTimer = opts.blinkStart;
		}
		if (opts.blinkTimer) {
			this.blinkTimer = opts.blinkTimer;
		}

		this._x = new AnimatedProperty();
		this._y = new AnimatedProperty();

		this.container.addChild(this.eyeContainer);

		if (opts.container) opts.container.addChild(this.container);

		this.base = new PIXI.Graphics()
			.ellipse(0, 0, this.size, this.size * 0.9)
			.fill(opts.eyeColor ?? 0xffffff);
		this.base.alpha = 1;
		this.eyeContainer.addChild(this.base);

		this.pupil = new PIXI.Graphics()
			.circle(0, 0, this.size * 0.6)
			.fill(opts.pupilColor ?? 0x000000)
			.circle(this.size * 0.3, this.size * 0.3, 0.2 * this.size)
			.fill({ color: 0xffffff, alpha: 0.7 });
		this.eyeContainer.addChild(this.pupil);

		this.mask = new PIXI.Graphics().ellipse(0, 0, this.size, this.size * 0.9).fill(0xffffff);
		this.eyeContainer.addChild(this.mask);
		this.eyeContainer.mask = this.mask;

		const eyebrowWidth = opts?.eyebrow?.width ?? 2;
		const eyebrowCurve = opts?.eyebrow?.curve ?? 0.2;

		const eyebrow = new PIXI.Graphics()
			.moveTo((-eyebrowWidth / 2) * this.size, 0)
			.quadraticCurveTo(0, eyebrowCurve * this.size, (eyebrowWidth / 2) * this.size, 0)
			.stroke({
				color: opts.eyebrow?.color ?? 0,
				width: opts.eyebrow?.width ?? this.size * 0.2
			});
		eyebrow.position.set(opts.eyebrow?.x ?? 0, (opts.eyebrow?.y ?? 0.9) * this.size);

		// this.container.addChild(eyebrow);
	}

	lookInDirection(direction: number) {
		const angle = degreesToRadians(direction);

		this.lookAt(Math.cos(angle), Math.sin(angle));
	}

	lookAt(x: number, y: number) {
		this._x.set(x * this.size * 0.3);
		this._y.set(y * this.size * 0.3);
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
