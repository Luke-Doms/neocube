

export function ApplyRotation(gl, selectedFace, mouseEvent, projMatrix, viewMatrix) {
	const mouseUpNDC= GetClipCoords(gl, mouseEvent);
	var viewProjMatrix = glMatrix.mat4.create();
	glMatrix.mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
	var inverseViewProjMatrix = glMatrix.mat4.create();
	glMatrix.mat4.invert(inverseViewProjMatrix, viewProjMatrix);
	var originWorld = glMatrix.vec4.create();
	glMatrix.vec4.transformMat4(mouseUpWorld, mouseUpNDC, inverseViewProjMatrix);

	originWorld = Convert(originWorld);
	var rayDirection = glMatrix.vec3.create();
	glMatrix.vec3.subtract(rayDirection, originWorld, position);
	glMatrix.vec3.normalize(rayDirection, rayDirection);
}
