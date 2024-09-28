

export function ApplyRotation(gl, rotationAxis, selectedFace, puzzleModel, dims) {
	const indices = glMatrix.vec3.fromValues(0, 1, 2);
	const abs = glMatrix.vec3.fromValues(Math.abs(rotationAxis[0]), Math.abs(rotationAxis[1]), Math.abs(rotationAxis[2]));
	const sliceIndex = glMatrix.vec3.dot(indices, abs);
	const sliceValue = glMatrix.vec3.dot(selectedFace.point, abs);

	dims.splice(sliceIndex, 1);
	var angle;
	if (dims[0] == dims[1]) {
		angle = glMatrix.glMatrix.toRadian(90); //need to generalize this
	} else {
		angle = glMatrix.glMatrix.toRadian(180); //need to generalize this
	}
	var worldCoord = glMatrix.vec3.create();

	for (var i in puzzleModel) { 
		glMatrix.vec3.transformMat4(worldCoord, puzzleModel[i].center, puzzleModel[i].worldMatrix);
		//if (puzzleModel[i].center[sliceIndex] - 1 < sliceValue && sliceValue < puzzleModel[i].center[sliceIndex] + 1) {
		if (worldCoord[sliceIndex] - 1 < sliceValue && sliceValue < worldCoord[sliceIndex] + 1) {
			var buffer = glMatrix.mat4.create();
			glMatrix.mat4.rotate(buffer, buffer, -angle, rotationAxis);
			glMatrix.mat4.multiply(puzzleModel[i].worldMatrix, buffer, puzzleModel[i].worldMatrix);
		}
	}
}
