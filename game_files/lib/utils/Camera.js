import { GetClipCoords, Convert } from './ConvertCoords.js';

export class Camera {
	constructor(pos, up) {
		//camera is always looking at the origin, so no need for a direction vector
		this.pos = pos;
		this.up = up;
		this.initialMouseEvent;
		this.update = false;
	}

	Move(gl, event, viewMatrix, projMatrix) {
		const clipCoord = GetClipCoords(gl, event);
		const inverse = glMatrix.mat4.create();
		const viewProjMatrix = glMatrix.mat4.create();
		glMatrix.mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
		glMatrix.mat4.invert(inverse, viewProjMatrix);
		glMatrix.vec4.transformMat4(clipCoord, clipCoord, inverse);

		const clipCoordFormer = GetClipCoords(gl, this.initialMouseEvent);
		glMatrix.vec4.transformMat4(clipCoordFormer, clipCoordFormer, inverse);

		const swipeDirection = glMatrix.vec3.create();
		const rotationAxis = glMatrix.vec3.create();
		glMatrix.vec4.subtract(swipeDirection, Convert(clipCoord), Convert(clipCoordFormer));
		glMatrix.vec3.cross(rotationAxis, swipeDirection, this.pos);

		const rotation = glMatrix.mat4.create();	
		glMatrix.mat4.fromRotation(rotation, .5 * glMatrix.vec3.length(rotationAxis), rotationAxis);
		const posHomogenous = glMatrix.vec4.fromValues(this.pos[0], this.pos[1], this.pos[2], 1);
		const upHomogenous = glMatrix.vec4.fromValues(this.up[0], this.up[1], this.up[2], 1);
		glMatrix.vec4.transformMat4(posHomogenous, posHomogenous, rotation);
		glMatrix.vec4.transformMat4(upHomogenous, upHomogenous, rotation);
		this.pos = Convert(posHomogenous);
		this.up = Convert(upHomogenous);

		this.initialMouseEvent = event;
		this.update = true;
	}
}

/*
camera.prototype.Move = function (gl, e, viewMatrix, projMatrix, lookDirection) {
  const clipCoord = getClipCoord(gl, e);
  const inverse = glMatrix.mat4.create();
  const viewProjMatrix = glMatrix.mat4.create();
  glMatrix.mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
  glMatrix.mat4.invert(inverse, viewProjMatrix);
  glMatrix.vec4.transformMat4(clipCoord, clipCoord, inverse);

  const clipCoordFormer = getClipCoord(gl, this.initialMouseEvent);
  glMatrix.vec4.transformMat4(clipCoordFormer, clipCoordFormer, inverse);

  const swipeDirection = glMatrix.vec3.create();
  const rotationAxis = glMatrix.vec3.create();
  glMatrix.vec4.subtract(swipeDirection, convert(clipCoord), convert(clipCoordFormer));
  glMatrix.vec3.cross(rotationAxis, swipeDirection, lookDirection);

  const newView = glMatrix.mat4.create();
  const rot = glMatrix.mat4.create();
  glMatrix.mat4.fromRotation(rot, -.5 * glMatrix.vec3.length(rotationAxis), rotationAxis);
  const lookHomogenous = glMatrix.vec4.fromValues(lookDirection[0], lookDirection[1], lookDirection[2], 1);
  glMatrix.mat4.multiply(newView, viewMatrix, rot);
  glMatrix.mat4.invert(rot, rot);
  glMatrix.vec4.transformMat4(lookHomogenous, lookHomogenous, rot);
  lookDirection = convert(lookHomogenous);
  this.initialMouseEvent = e;
  return [newView, lookDirection];
}
*/
