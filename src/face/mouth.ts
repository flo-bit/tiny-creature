import * as PIXI from "pixi.js";
import { AnimatedValue, degreesToRadians } from "./math-helper";

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

export default class Mouth {
  eyeContainer: PIXI.Container;

  container: PIXI.Container;

  base?: PIXI.Graphics;

  _x: AnimatedValue;
  _y: AnimatedValue;

  dx: number = 0;
  dy: number = 0;

  size: number = 1;

  targetX: number = 0;
  targetY: number = 0;

  constructor(opts: Partial<EyeOptions>) {
    console.log("Eye", opts);
    this.container = new PIXI.Container();

    this.eyeContainer = new PIXI.Container();

    this.container.position.set(opts.x ?? 0, opts.y ?? 0);

    this.size = opts.size ?? 1;

    this._x = new AnimatedValue();
    this._y = new AnimatedValue();

    this.container.addChild(this.eyeContainer);

    if (opts.container) opts.container.addChild(this.container);

    let eyebrowWidth = opts?.eyebrow?.width ?? 2;
    let eyebrowCurve = opts?.eyebrow?.curve ?? -0.3;

    const eyebrow = new PIXI.Graphics()
      .moveTo((-eyebrowWidth / 2) * this.size, 0)
      .quadraticCurveTo(
        0,
        eyebrowCurve * this.size,
        (eyebrowWidth / 2) * this.size,
        0,
      )
      .stroke({
        color: opts.eyebrow?.color ?? 0,
        width: opts.eyebrow?.width ?? this.size * 0.2,
      });
    eyebrow.position.set(
      opts.eyebrow?.x ?? 0,
      (opts.eyebrow?.y ?? 0.9) * this.size,
    );

    this.container.addChild(eyebrow);
  }
}
