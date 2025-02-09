export const options = $state({
	hasChanged: false,

	leftEyebrow: {
		x: 75,
		y: 80,
		width: 100,
		curve: 20,
		stroke: 10,
		angle: 0,
		sharpness: 0,
		color: '#515151'
	},
	rightEyebrow: {
		x: -75,
		y: 80,
		width: 100,
		curve: 20,
		stroke: 10,
		angle: 0,
		sharpness: 0,
		color: '#515151'
	},
	mouth: {
		x: 0,
		y: -130,
		stroke: 20,
		color: '#000000',
		width: 100,
		curve: -40
	},
	leftEye: {
		x: 75,
		y: 0,
		sizeX: 50,
		sizeY: 50,
		pupilSizeX: 20,
		pupilSizeY: 20
	},
	rightEye: {
		x: -75,
		y: 0,
		sizeX: 50,
		sizeY: 50,
		pupilSizeX: 20,
		pupilSizeY: 20
	},

	currentEmotion: '',

	emotions: {
		base: {
			leftEyebrow: {
				x: 75,
				y: 80,
				width: 100,
				curve: 20,
				stroke: 10,
				angle: 0,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -75,
				y: 80,
				width: 100,
				curve: 20,
				stroke: 10,
				angle: 0,
				sharpness: 0,
				color: '#515151'
			},
			mouth: { x: 0, y: -130, stroke: 20, color: '#000000', width: 100, curve: -40 },
			leftEye: { x: 75, y: 0, sizeX: 50, sizeY: 50, pupilSizeX: 20, pupilSizeY: 20 },
			rightEye: { x: -75, y: 0, sizeX: 50, sizeY: 50, pupilSizeX: 20, pupilSizeY: 20 }
		},
		scared: {
			leftEyebrow: {
				x: 110,
				y: 80,
				width: 70,
				curve: -20,
				stroke: 10,
				angle: -18,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -110,
				y: 80,
				width: 70,
				curve: -20,
				stroke: 10,
				angle: 18,
				sharpness: 0,
				color: '#515151'
			},
			mouth: { x: 0, y: -130, stroke: 30, color: '#000000', width: 150, curve: 40 },
			leftEye: { x: 75, y: 0, sizeX: 50, sizeY: 40, pupilSizeX: 20, pupilSizeY: 20 },
			rightEye: { x: -75, y: 0, sizeX: 50, sizeY: 40, pupilSizeX: 20, pupilSizeY: 20 }
		},
		surprised: {
			leftEyebrow: {
				x: 90,
				y: 120,
				width: 100,
				curve: 100,
				stroke: 15,
				angle: -10,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -90,
				y: 120,
				width: 100,
				curve: 100,
				stroke: 15,
				angle: 10,
				sharpness: 0,
				color: '#515151'
			},
			mouth: { x: 0, y: -160, stroke: 100, color: '#000000', width: 40, curve: -5 },
			leftEye: { x: 75, y: 0, sizeX: 70, sizeY: 70, pupilSizeX: 30, pupilSizeY: 30 },
			rightEye: { x: -75, y: 0, sizeX: 70, sizeY: 70, pupilSizeX: 30, pupilSizeY: 30 }
		},
		angry: {
			leftEyebrow: {
				x: 75,
				y: 80,
				width: 50,
				curve: -10,
				stroke: 10,
				angle: 30,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -75,
				y: 80,
				width: 50,
				curve: -10,
				stroke: 10,
				angle: -30,
				sharpness: 0,
				color: '#515151'
			},
			mouth: { x: 0, y: -130, stroke: 20, color: '#000000', width: 70, curve: 0 },
			leftEye: { x: 75, y: -20, sizeX: 50, sizeY: 40, pupilSizeX: 20, pupilSizeY: 20 },
			rightEye: { x: -75, y: -20, sizeX: 50, sizeY: 40, pupilSizeX: 20, pupilSizeY: 20 }
		},
		sad: {
			leftEyebrow: {
				x: 75,
				y: 80,
				width: 100,
				curve: -20,
				stroke: 10,
				angle: -10,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -75,
				y: 80,
				width: 100,
				curve: -20,
				stroke: 10,
				angle: 10,
				sharpness: 0,
				color: '#515151'
			},
			mouth: { x: 0, y: -130, stroke: 20, color: '#000000', width: 100, curve: 20 },
			leftEye: { x: 75, y: 0, sizeX: 60, sizeY: 60, pupilSizeX: 25, pupilSizeY: 25 },
			rightEye: { x: -75, y: 0, sizeX: 60, sizeY: 60, pupilSizeX: 25, pupilSizeY: 25 }
		},
		excited: {
			leftEyebrow: {
				x: 75,
				y: 100,
				width: 100,
				curve: 40,
				stroke: 10,
				angle: 0,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -75,
				y: 100,
				width: 100,
				curve: 40,
				stroke: 10,
				angle: 0,
				sharpness: 0,
				color: '#515151'
			},
			mouth: { x: 0, y: -130, stroke: 40, color: '#000000', width: 150, curve: -80 },
			leftEye: { x: 75, y: 0, sizeX: 50, sizeY: 60, pupilSizeX: 25, pupilSizeY: 25 },
			rightEye: { x: -75, y: 0, sizeX: 50, sizeY: 60, pupilSizeX: 25, pupilSizeY: 25 }
		}
	},
	colors: {
		primary: '#ec4899',
		secondary: '#fb923c'
	}
});
