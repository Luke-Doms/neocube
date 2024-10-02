import * as glMatrix from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';




export function GetCubiesToRotate(gl, rotationAxis, selectedFace, puzzleModel, dims) {
	const indices = glMatrix.vec3.fromValues(0, 1, 2);
	const abs = glMatrix.vec3.fromValues(Math.abs(rotationAxis[0]), Math.abs(rotationAxis[1]), Math.abs(rotationAxis[2]));
	const sliceIndex = glMatrix.vec3.dot(indices, abs);
	const sliceValue = glMatrix.vec3.dot(selectedFace.point, abs);

	dims.splice(sliceIndex, 1);
	var rotationAngle;
	if (dims[0] == dims[1]) {
		rotationAngle = glMatrix.glMatrix.toRadian(90);
	} else {
		rotationAngle = glMatrix.glMatrix.toRadian(180);
	}
	var worldCoord = glMatrix.vec3.create();

	var rotationParams = {
		cubies: [],
		angle: rotationAngle, 
		axis: rotationAxis
	}
	for (var i in puzzleModel) { 
		glMatrix.vec3.transformMat4(worldCoord, puzzleModel[i].center, puzzleModel[i].worldMatrix);
		if (worldCoord[sliceIndex] - 1 < sliceValue && sliceValue < worldCoord[sliceIndex] + 1) {
			var buffer = glMatrix.mat4.create();
			glMatrix.mat4.copy(buffer, puzzleModel[i].worldMatrix);
			rotationParams.cubies.push({
				index: i, 
				worldMatrix: buffer
			});
			/*
			*/
		}
	}
	return rotationParams;
}

export function ApplyRotation(gl, rotationParams, rotationDuration, puzzleModel) {
	var dt = rotationDuration/1000 * 2;
	if (dt > 1) {
		dt = 1;
	}

	for (var i in rotationParams.cubies) { 
		var buffer = glMatrix.mat4.create();
		glMatrix.mat4.rotate(buffer, buffer, -rotationParams.angle * dt, rotationParams.axis);
		glMatrix.mat4.multiply(puzzleModel[rotationParams.cubies[i].index].worldMatrix, buffer, rotationParams.cubies[i].worldMatrix);	
	}
	if (dt == 1) {
		return false;
	}
	return true;
}
