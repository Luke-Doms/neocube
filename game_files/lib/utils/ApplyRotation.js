import { GetClipCoords, Convert } from './ConvertCoords.js';

function RayPlaneIntersection(planeNormal, planePoint, ray, rayOrigin) {
	//assumes vectors are normalized
	console.log("planeNormal", planeNormal, "planePoint", planePoint, "ray", ray, "rayOrigin", rayOrigin);
	const denom = glMatrix.vec3.dot(planeNormal, ray);
	console.log(denom);
	if (denom != 0) {
		const diff = glMatrix.vec3.create();
		glMatrix.vec3.subtract(diff, planePoint, rayOrigin);
		const t = glMatrix.vec3.dot(diff, planeNormal) / denom;
		console.log(t);
		const intersectionPoint = glMatrix.vec3.create();
		glMatrix.vec3.scale(intersectionPoint, ray, t);
		glMatrix.vec3.add(intersectionPoint, intersectionPoint, rayOrigin);
		return intersectionPoint;
	}
	return false;
}

export function ApplyRotation(gl, selectedFace, mouseEvent, position, projMatrix, viewMatrix) {
	const mouseUpNDC= GetClipCoords(gl, mouseEvent);
	var viewProjMatrix = glMatrix.mat4.create();
	glMatrix.mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
	var inverseViewProjMatrix = glMatrix.mat4.create();
	glMatrix.mat4.invert(inverseViewProjMatrix, viewProjMatrix);
	var mouseUpWorld = glMatrix.vec4.create();
	glMatrix.vec4.transformMat4(mouseUpWorld, mouseUpNDC, inverseViewProjMatrix);

	mouseUpWorld = Convert(mouseUpWorld);
	var rayDirection = glMatrix.vec3.create();
	glMatrix.vec3.subtract(rayDirection, mouseUpWorld, position);
	glMatrix.vec3.normalize(rayDirection, rayDirection);

	const mouseUpIntersectionPoint = RayPlaneIntersection(selectedFace.normal, selectedFace.point, rayDirection, position);
	const swipeVector = glMatrix.vec3.create();
	console.log(selectedFace, mouseUpIntersectionPoint);
	glMatrix.vec3.subtract(swipeVector, selectedFace.point, mouseUpIntersectionPoint);
	console.log(swipeVector);
}
