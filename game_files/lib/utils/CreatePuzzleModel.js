import { CreateModel } from './CreateModel.js';
//Name all constants up here .
const green = {
	color:[0/255, 155/255, 72/255], 
	normal: [-1, 0, 0]
};
const white = {
	color:[255/255, 255/255, 255/255], 
	normal: [0, -1, 0]
};
const red = {
	color:[183/255, 18/255, 52/255], 
	normal: [0, 0, -1]
};
const yellow = {
	color:[255/255, 213/255, 0/255], 
	normal: [0, 1, 0]
};
const blue = {
	color:[0/255, 70/255, 173/255], 
	normal: [1, 0, 0]
};
const orange = {
	color:[255/255, 88/255, 0/255], 
	normal: [0, 0, 1]
};
function Equal(arr1, arr2) {
	var out = true;
	var k = 0;
	while (out && k < arr1.length) {
		if (arr1[k] != arr2[k]) {
			out = false;
		}
		k++;
	}
	return out;
}
function ApplyColors(colors, cubie) {
	for (var i = 0; i < 36; i++) {
		var xNormal = i*11 + 8;
		for (var color in colors) {
			if (Equal(colors[color].normal, cubie.slice(xNormal, xNormal + 3))) {
				cubie[xNormal - 5] = colors[color].color[0];
				cubie[xNormal - 4] = colors[color].color[1];
				cubie[xNormal - 3] = colors[color].color[2];
			}
		}
	}
}

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
					var xIndex = d*11;
					var yIndex = d*11 + 1;
					var zIndex = d*11 + 2;
					newCubie[xIndex] = newCubie[xIndex] + xOffset;
					newCubie[yIndex] = newCubie[yIndex] + yOffset;
					newCubie[zIndex] = newCubie[zIndex] + zOffset;
				}

				const center = glMatrix.vec3.fromValues(
					(-(2.2*x)/2 + .1) + a*2.2 + 1,
					(-(2.2*y)/2 + .1) + b*2.2 + 1,
					(-(2.2*z)/2 + .1) + c*2.2 + 1
				);

				var colors = [];
				if (a == 0) {
					colors.push(green);
				}
				if (a == x - 1) {
					colors.push(blue);
				}
				if (b == 0) {
					colors.push(white);
				}
				if (b == y - 1) {
					colors.push(yellow);
				}
				if (c == 0) {
					colors.push(red);
				}
				if (c == z - 1) {
					colors.push(orange);
				}
				ApplyColors(colors, newCubie);

				const model = CreateModel(gl, newCubie, center);
				cubies.push(model);

			}
		}
	}
	return cubies;
}
