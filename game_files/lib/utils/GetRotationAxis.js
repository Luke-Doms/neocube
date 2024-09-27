import { GetClipCoords, Convert } from './ConvertCoords.js';

function RayPlaneIntersection(planeNormal, planePoint, ray, rayOrigin) {
	//assumes vectors are normalized
	const denom = glMatrix.vec3.dot(planeNormal, ray);
	if (denom != 0) {
		const diff = glMatrix.vec3.create();
		glMatrix.vec3.subtract(diff, planePoint, rayOrigin);
		const t = glMatrix.vec3.dot(diff, planeNormal) / denom;
		const intersectionPoint = glMatrix.vec3.create();
		glMatrix.vec3.scale(intersectionPoint, ray, t);
		glMatrix.vec3.add(intersectionPoint, intersectionPoint, rayOrigin);
		return intersectionPoint;
	}
	return false;
}

//rename GetSwipeVector
export function GetRotationAxis(gl, selectedFace, mouseEvent, position, projMatrix, viewMatrix) {
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
	glMatrix.vec3.subtract(swipeVector, selectedFace.point, mouseUpIntersectionPoint);
	
	//get rotation axis
	//get the dot of the swipeVector with the basis ones and take the biggest absolute value and multiply by basis vector and normalize, then take dot product with normal to get rotation axis (parity gives rotation direction)
	var directionVecs = [];
	var e_1 = glMatrix.vec3.fromValues(1, 0, 0);
	var e_2 = glMatrix.vec3.fromValues(0, 1, 0);
	var e_3 = glMatrix.vec3.fromValues(0, 0, 1);
	var e_4 = glMatrix.vec3.fromValues(-1, 0, 0);
	var e_5 = glMatrix.vec3.fromValues(0, -1, 0);
	var e_6 = glMatrix.vec3.fromValues(0, 0, -1);
	directionVecs.push(e_1, e_2, e_3, e_4, e_5, e_6);
	const products = directionVecs.map((e_i) => glMatrix.vec3.dot(e_i, swipeVector));
	const swipeDirectionIndex = products.reduce((out, curVal, curIndex, arr) => curVal > arr[out] ? curIndex : out, 0); //could just return the correct vector with reduce
	const swipeDirection = directionVecs[swipeDirectionIndex];
	var rotationAxis = glMatrix.vec3.create();
	glMatrix.vec3.cross(rotationAxis, selectedFace.normal, swipeDirection);
	return rotationAxis;
}
