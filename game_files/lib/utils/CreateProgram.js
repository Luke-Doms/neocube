
export async function GetShaderText(shader) {	
	const response = await fetch(shader);
	const shaderText = await response.text();
	return shaderText;
}

export function CreateShaderProgram(gl, vsText, fsText) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vertexShader, vsText);
	gl.shaderSource(fragmentShader, fsText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		throw `failed to compile vertex shader ${gl.getShaderInfoLog(vertexShader)}`;
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		throw `failed to compile fragment shader ${gl.getShaderInfoLog(fragmentShader)}`;
	}

	const program = gl.createProgram();

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const info = gl.getProgramInfoLog(program);
		throw `Failed to compile program \n ${info}`;
	}

	return program;
}
