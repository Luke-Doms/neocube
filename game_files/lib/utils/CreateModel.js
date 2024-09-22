

export function CreateModel(gl, data, center) {
	var buffer_id = gl.createBuffer();

	if (!buffer_id) {
		console.log("failed to create buffer.");
		return null;
	}

	var model = {
		vertices: data, 
		worldMatrix: glMatrix.mat4.create(),
		buffer_id: gl.createBuffer(), 
		center: center
	};
	
	gl.bindBuffer(gl.ARRAY_BUFFER, model.buffer_id);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

	return model;
}
