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
		curve: -40,
		upperLipStroke: 30,

		upperLipCx1: -30,
		upperLipCy1: -20,
		upperLipCx2: 30,
		upperLipCy2: -20,

		lowerLipStroke: 30,

		lowerLipCx1: 30,
		lowerLipCy1: -40,
		lowerLipCx2: -30,
		lowerLipCy2: -40,

		mouthWidth: 200
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
			mouth: {
				x: 0,
				y: -130,
				stroke: 20,
				color: '#000000',
				width: 100,
				curve: -40,
				upperLipStroke: 30,
				upperLipCx1: -30,
				upperLipCy1: -20,
				upperLipCx2: 30,
				upperLipCy2: -20,
				lowerLipStroke: 30,
				lowerLipCx1: 30,
				lowerLipCy1: -40,
				lowerLipCx2: -30,
				lowerLipCy2: -40,
				mouthWidth: 200
			},
			leftEye: { x: 75, y: 0, sizeX: 60, sizeY: 60, pupilSizeX: 25, pupilSizeY: 25 },
			rightEye: { x: -75, y: 0, sizeX: 60, sizeY: 60, pupilSizeX: 25, pupilSizeY: 25 }
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
			mouth: {
				x: 0,
				y: -130,
				stroke: 30,
				color: '#000000',
				width: 150,
				curve: 40,
				upperLipStroke: 30,
				upperLipCx1: -70,
				upperLipCy1: 20,
				upperLipCx2: 70,
				upperLipCy2: 30,
				lowerLipStroke: 30,
				lowerLipCx1: 40,
				lowerLipCy1: -10,
				lowerLipCx2: -40,
				lowerLipCy2: 5,
				mouthWidth: 200
			},
			leftEye: { x: 75, y: 0, sizeX: 60, sizeY: 55, pupilSizeX: 25, pupilSizeY: 25 },
			rightEye: { x: -75, y: 0, sizeX: 60, sizeY: 55, pupilSizeX: 25, pupilSizeY: 25 }
		},
		surprised: {
			leftEyebrow: {
				x: 90,
				y: 120,
				width: 100,
				curve: 100,
				stroke: 10,
				angle: -10,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -90,
				y: 120,
				width: 100,
				curve: 100,
				stroke: 10,
				angle: 10,
				sharpness: 0,
				color: '#515151'
			},
			mouth: {
				x: 0,
				y: -160,
				stroke: 100,
				color: '#000000',
				width: 70,
				curve: -5,
				upperLipStroke: 30,
				upperLipCx1: -30,
				upperLipCy1: 30,
				upperLipCx2: 40,
				upperLipCy2: 30,
				lowerLipStroke: 30,
				lowerLipCx1: 30,
				lowerLipCy1: -40,
				lowerLipCx2: -30,
				lowerLipCy2: -40,
				mouthWidth: 200
			},
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
			mouth: {
				x: 0,
				y: -130,
				stroke: 20,
				color: '#000000',
				width: 70,
				curve: 0,
				upperLipStroke: 30,
				upperLipCx1: -10,
				upperLipCy1: -20,
				upperLipCx2: 10,
				upperLipCy2: 10,
				lowerLipStroke: 30,
				lowerLipCx1: 10,
				lowerLipCy1: 10,
				lowerLipCx2: -10,
				lowerLipCy2: -20,
				mouthWidth: 200
			},
			leftEye: { x: 75, y: -20, sizeX: 60, sizeY: 50, pupilSizeX: 25, pupilSizeY: 25 },
			rightEye: { x: -75, y: -20, sizeX: 60, sizeY: 50, pupilSizeX: 25, pupilSizeY: 25 }
		},
		sad: {
			leftEyebrow: {
				x: 75,
				y: 90,
				width: 100,
				curve: -20,
				stroke: 10,
				angle: -10,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -75,
				y: 90,
				width: 100,
				curve: -20,
				stroke: 10,
				angle: 10,
				sharpness: 0,
				color: '#515151'
			},
			mouth: {
				x: 0,
				y: -130,
				stroke: 20,
				color: '#000000',
				width: 60,
				curve: 20,
				upperLipStroke: 30,
				upperLipCx1: -30,
				upperLipCy1: 20,
				upperLipCx2: 30,
				upperLipCy2: 20,
				lowerLipStroke: 30,
				lowerLipCx1: 30,
				lowerLipCy1: 10,
				lowerLipCx2: -50,
				lowerLipCy2: 10,
				mouthWidth: 200
			},
			leftEye: { x: 75, y: 0, sizeX: 70, sizeY: 70, pupilSizeX: 25, pupilSizeY: 25 },
			rightEye: { x: -75, y: 0, sizeX: 70, sizeY: 70, pupilSizeX: 25, pupilSizeY: 25 }
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
			mouth: {
				x: 0,
				y: -130,
				stroke: 40,
				color: '#000000',
				width: 180,
				curve: -80,
				upperLipStroke: 30,
				upperLipCx1: -30,
				upperLipCy1: -10,
				upperLipCx2: 30,
				upperLipCy2: -10,
				lowerLipStroke: 30,
				lowerLipCx1: 30,
				lowerLipCy1: -70,
				lowerLipCx2: -30,
				lowerLipCy2: -50,
				mouthWidth: 200
			},
			leftEye: { x: 75, y: 0, sizeX: 60, sizeY: 70, pupilSizeX: 25, pupilSizeY: 25 },
			rightEye: { x: -75, y: 0, sizeX: 60, sizeY: 70, pupilSizeX: 25, pupilSizeY: 25 }
		},
		test: {
			leftEyebrow: {
				x: 75,
				y: 100,
				width: 100,
				curve: 40,
				stroke: 5,
				angle: 0,
				sharpness: 0,
				color: '#515151'
			},
			rightEyebrow: {
				x: -75,
				y: 100,
				width: 100,
				curve: 40,
				stroke: 5,
				angle: 0,
				sharpness: 0,
				color: '#515151'
			},
			mouth: {
				x: 0,
				y: -130,
				stroke: 40,
				color: '#000000',
				width: 150,
				curve: -80,
				upperLipStroke: 50,
				upperLipCurve: -40,
				lowerLipStroke: 50,
				lowerLipCurve: -120,
				mouthWidth: 200
			},
			leftEye: { x: 75, y: 0, sizeX: 50, sizeY: 60, pupilSizeX: 80, pupilSizeY: 80 },
			rightEye: { x: -75, y: 0, sizeX: 50, sizeY: 60, pupilSizeX: 80, pupilSizeY: 80 }
		}
	},
	colors: {
		primary: '#ec4899',
		secondary: '#fb923c'
	}
});
