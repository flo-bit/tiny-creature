export const options = $state({
	hasChanged: false,
	leftEyebrow: {
		x: 75,
		y: 80,
		width: 100,
		curve: 20,
		stroke: 10,
		angle: 0
	},
	rightEyebrow: {
		x: -75,
		y: 80,
		width: 100,
		curve: 20,
		stroke: 10,
		angle: 0
	},
	mouth: {
		x: 0,
		y: -130,
		stroke: 20,
		color: 0,
		width: 100,
		curve: -40
	},
	colors: {
		primary: '#ec4899',
		secondary: '#fb923c'
	}
});
