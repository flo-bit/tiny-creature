/**
 * Smoothly transitions between two values.
 *
 * This function helps you move from a starting value (source) to an ending value (target)
 * based on an amount between 0 and 1. If the amount is 0, you get the source value.
 * If it's 1, you get the target value. Values in between give you a mix of both.
 *
 * @param {number} source - The value to start from.
 * @param {number} target - The value to move towards.
 * @param {number} amount - A number between 0 and 1 that controls how much to move
 *                          from the source to the target.
 * @returns {number} The value in between source and target, depending on the amount.
 */
export function smoothStep(source: number, target: number, amount: number): number {
	return source * (1 - amount) + target * amount;
}

/**
 * Smoothly transitions between two values, adjusting for different frame rates.
 *
 * This function helps you move from a starting value (source) to an ending value (target),
 * but it also adjusts for how fast your program is running (its framerate). This ensures that
 * the transition is smooth and consistent, even if the framerate changes.
 *
 * If the `frameDelta` (the time between frames) is not provided, the function will simply move
 * from the source to the target based on the rate you provide, similar to the basic smooth transition.
 *
 * If the `frameDelta` is provided, the function takes this into account to make sure that the transition
 * speed is consistent, no matter how fast or slow the program runs.
 *
 * @param {number} source - The value to start from.
 * @param {number} target - The value to move towards.
 * @param {number} rate - Controls how quickly to move from source to target.
 *                        A value of 0 means no movement, and 1 means an instant jump to the target.
 *                        Values in between result in smoother, more gradual transitions.
 * @param {number} frameDelta - The time between frames (in seconds), used to adjust the rate
 *                              and ensure smooth transitions at any framerate.
 * @param {number} [targetFps=60] - The target frames per second, usually 60 by default.
 * @returns {number} The value in between source and target, adjusted for framerate.
 */
export function framerateIndependentSmoothStep(
	source: number,
	target: number,
	rate: number,
	frameDelta: number,
	targetFps = 60
): number {
	if (typeof frameDelta === 'undefined') {
		return smoothStep(source, target, rate);
	}

	const relativeDelta = frameDelta / (1 / targetFps);
	const smoothing = 1 - rate;
	return smoothStep(source, target, 1 - Math.pow(smoothing, relativeDelta));
}

/**
 * Converts an angle from degrees to radians.
 *
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 */
export function degreesToRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}

/**
 * Converts an angle from radians to degrees.
 *
 * @param {number} radians - The angle in radians.
 * @returns {number} The angle in degrees.
 */
export function radiansToDegrees(radians: number): number {
	return radians * (180 / Math.PI);
}

/**
 * Restricts a value to stay within a certain range.
 *
 * This function makes sure a number doesn't go below a minimum value or above a maximum value.
 * If the number is lower than the minimum, it returns the minimum. If it's higher than the maximum,
 * it returns the maximum. If the number is within the range, it stays unchanged.
 *
 * @param {number} value - The number you want to restrict.
 * @param {number} min - The lowest value the number can be.
 * @param {number} max - The highest value the number can be.
 * @returns {number} The number, but kept within the specified range.
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Loops a number around a range.
 *
 * This function makes a number loop back to the start if it goes past the end of a range,
 * or to the end if it goes below the start. For example, if you're counting seconds on a clock
 * and you reach 60, you wrap back around to 0.
 *
 * @param {number} value - The number you want to loop.
 * @param {number} min - The start of the range.
 * @param {number} max - The end of the range.
 * @returns {number} The wrapped number within the range.
 */
export function wrap(value: number, min: number, max: number): number {
	return ((value - min) % (max - min)) + min;
}

/**
 * Converts a number from one range to another.
 *
 * This function takes a number that's within one range of values and converts it to be within
 * another range of values. For example, you might want to take a score out of 100 and convert it
 * to a percentage out of 10, or take a health bar that's between 0 and 100 and map it to a progress
 * bar that's between 0 and 1.
 *
 * @param {number} value - The number you want to convert.
 * @param {number} inMin - The start of the current range.
 * @param {number} inMax - The end of the current range.
 * @param {number} outMin - The start of the new range.
 * @param {number} outMax - The end of the new range.
 * @returns {number} The number converted to the new range.
 */
export function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

const epsilon = 0.00001;

export class AnimatedProperty {
	_value: number;
	_target: number;

	rate: number;

	needsUpdate: boolean = false;

	constructor(value: number = 0, rate: number = 0.1) {
		this._value = value;
		this._target = value;
		this.rate = rate;
	}

	setInstantly(value: number) {
		this._value = value;
		this.needsUpdate = true;
	}

	get value() {
		return this._value;
	}

	set target(value: number) {
		this._target = value;
		this.needsUpdate = true;
	}

	set(target: number) {
		this._target = target;
		this.needsUpdate = true;
	}

	get(): number {
		return this._value;
	}

	update(dt: number) {
		if (!this.needsUpdate) return false;

		this._value = framerateIndependentSmoothStep(this._value, this._target, this.rate, dt);
		this.needsUpdate = Math.abs(this._value - this._target) > epsilon;

		return true;
	}
}

export class AnimatedProperties<T extends Record<string, number>> {
	private readonly properties: { [K in keyof T]: AnimatedProperty };

	constructor(initialValues: T, defaultRate: number = 0.1) {
		this.properties = {} as { [K in keyof T]: AnimatedProperty };
		for (const key in initialValues) {
			this.properties[key] = new AnimatedProperty(initialValues[key], defaultRate);
		}
	}

	// Get the property directly via dot notation
	get<K extends keyof T>(key: K): number {
		return this.properties[key].get();
	}

	set<K extends keyof T>(key: K, value: number) {
		this.properties[key].set(value);
	}

	// Update all animated values
	update(dt: number): boolean {
		let anyUpdated = false;
		for (const key in this.properties) {
			if (this.properties[key].update(dt)) {
				anyUpdated = true;
			}
		}
		return anyUpdated;
	}
}