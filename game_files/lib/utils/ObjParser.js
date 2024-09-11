import { GetShaderText } from './CreateProgram.js';
//function that parses obj file and converts it to an array that can be attached to a webgl buffer object

	
export function ObjParser(objFile) {
	var bufferArray = [];
	var modelVertices = {
		positionVertices:[],
		textureCoords:[], 
		normals:[]
	}

	const lines = objFile.split('\n');
	console.log(lines);
	for (var l in lines) {
		var line = lines[l];
		line = line.trim();
		line = line.split(' ');
		switch (line.shift()) {
			case 'v':
				const newVertex = line.map((float) => parseFloat(float));
				modelVertices.positionVertices.push(newVertex);
				break;
			case 'vt': 
				const newCoords = line.map((float) => parseFloat(float));
				modelVertices.textureCoords.push(newCoords);
				break;
			case 'vn':
				const newNormal = line.map((float) => parseFloat(float));
				modelVertices.normals.push(newNormal);
				break;
			case 'f':
				break;
			default:
				break;
		}
	}
	return modelVertices;
}

