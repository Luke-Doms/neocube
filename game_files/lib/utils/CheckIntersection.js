import { GetClipCoords, Convert } from './ConvertCoords.js';

function IntersectionRayTriangle(v0World, v1World, v2World, rayDirection, position) {
	const v0v1 = glMatrix.vec3.create();
	const v0v2 = glMatrix.vec3.create();
	const pVec = glMatrix.vec3.create();

	glMatrix.vec3.subtract(v0v1, v1World, v0World);
	glMatrix.vec3.subtract(v0v2, v2World, v0World);
	glMatrix.vec3.cross(pVec, rayDirection, v0v2);
	const det = glMatrix.vec3.dot(v0v1, pVec);

	if (Math.abs(det) < Number.EPSILON) {
		return false;
	}

	const invDet = 1/det;
	const tVec = glMatrix.vec3.create();
	glMatrix.vec3.subtract(tVec, position, v0World);
	const u = glMatrix.vec3.dot(tVec, pVec) * invDet;
	if (u < 0 || u > 1) {
		return false;
	}


	const qVec = glMatrix.vec3.create();
	glMatrix.vec3.cross(qVec, tVec, v0v1);
	const v = glMatrix.vec3.dot(rayDirection, qVec) * invDet;
	if (v < 0 || v + u > 1) {
		return false;
	}

	const t = glMatrix.vec3.dot(v0v2, qVec) * invDet;
	return true;
}

export function CheckIntersection(gl, event, models, position, projMatrix, viewMatrix) {
	const originNDC = GetClipCoords(gl, event);
	var viewProjMatrix = glMatrix.mat4.create();
	glMatrix.mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
	var inverseViewProjMatrix = glMatrix.mat4.create();
	glMatrix.mat4.invert(inverseViewProjMatrix, viewProjMatrix);
	var originWorld = glMatrix.vec4.create();
	glMatrix.vec4.transformMat4(originWorld, originNDC, inverseViewProjMatrix);

	originWorld = Convert(originWorld);
	var rayDirection = glMatrix.vec3.create();
	glMatrix.vec3.subtract(rayDirection, originWorld, position);
	glMatrix.vec3.normalize(rayDirection, rayDirection);

	for (var i in models) {
		var model = models[i];
		for (var j = 0; j < 12; j++) {
			var v0 = glMatrix.vec3.fromValues(model.vertices[j*33], model.vertices[j*33 + 1], model.vertices[j*33 + 2]);
			var v1 = glMatrix.vec3.fromValues(model.vertices[j*33 + 11], model.vertices[j*33 + 12], model.vertices[j*33 + 13]);
			var v2 = glMatrix.vec3.fromValues(model.vertices[j*33 + 22], model.vertices[j*33 + 23], model.vertices[j*33 + 24]);

			var v0World = glMatrix.vec3.create();
			var v1World = glMatrix.vec3.create();
			var v2World = glMatrix.vec3.create();

			glMatrix.vec3.transformMat4(v0World, v0, model.worldMatrix);
			glMatrix.vec3.transformMat4(v1World, v1, model.worldMatrix);
			glMatrix.vec3.transformMat4(v2World, v2, model.worldMatrix);

			if (IntersectionRayTriangle(v0World, v1World, v2World, rayDirection, position)) {
				return true;
			}
		}
	}
	return false;
}
