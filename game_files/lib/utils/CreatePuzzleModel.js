import { CreateModel } from './CreateModel.js';
//Name all constants up here .

export function CreatePuzzleModel(gl, baseCubie, x, y, z) {
	var cubies = [];
	for (var a = 0; a < x; a++) {
		for (var b = 0; b < y; b++) {
			for (var c = 0; c < z; c++) {
				var newCubie = new Float32Array(baseCubie);
				const xOffset = (-(2.2*x)/2 + .1 + 1) + a*2.2;
				const yOffset = (-(2.2*y)/2 + .1 + 1) + b*2.2;
				const zOffset = (-(2.2*z)/2 + .1 + 1) + c*2.2;
				for (var d = 0; d < 36; d++) {
					var xIndex = d*8;
					var yIndex = d*8 + 1;
					var zIndex = d*8 + 2;
					newCubie[xIndex] = newCubie[xIndex] + xOffset;
					newCubie[yIndex] = newCubie[yIndex] + yOffset;
					newCubie[zIndex] = newCubie[zIndex] + zOffset;
				}
				const buffer = CreateModel(gl, newCubie);
				cubies.push(buffer);

			}
		}
	}
	return cubies;
}
