

export function CreateModel(gl, data) {
	var buffer_id = gl.createBuffer();

	if (!buffer_id) {
		console.log("failed to create buffer.");
		return null;
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

	return buffer_id;
}
