import {CreateModel} from './lib/utils/CreateModel.js';
import { GetShaderText , CreateShaderProgram } from './lib/utils/CreateProgram.js';
import * as vec3 from '/node_modules/gl-matrix/gl-matrix.js';
import * as mat4 from '/node_modules/gl-matrix/gl-matrix.js';

export class Scene {
  constructor (gl, dimensions) {
    this.gl = gl;
    this.dims = dimensions;
  }

  async Load() {
    var self = this;
    self.program;
    self.buffer;
    self.viewMatrix;
    self.projMatrix;
    self.look;

    const triangle = new Float32Array([1, 0, 0, 1, 0, 0, 
                                       0, 1, 0, 0, 1, 0, 
                                       0, 0, 1, 0, 0, 1]);

    const vertexShaderText = await GetShaderText('game_files/lib/shaders/VertexShader.glsl');
    const fragmentShaderText = await GetShaderText('game_files/lib/shaders/FragmentShader.glsl');

    self.program = CreateShaderProgram(self.gl, vertexShaderText, fragmentShaderText);

    self.buffer = CreateModel(self.gl, triangle);
    self.program.uniforms = {
      u_Proj: self.gl.getUniformLocation(self.program, 'u_Proj'),
      u_View: self.gl.getUniformLocation(self.program, 'u_View'),
      u_World: self.gl.getUniformLocation(self.program, 'u_World'),
    };

    self.program.attribs = {
      a_Position: self.gl.getAttribLocation(self.program, 'a_Position'),
      a_Color: self.gl.getAttribLocation(self.program, 'a_Color'),
    };

    self.viewMatrix = glMatrix.mat4.create();
    self.projMatrix = glMatrix.mat4.create();
    self.worldMatrix = glMatrix.mat4.create();
    self.look = glMatrix.vec3.fromValues(5, 5, 5);    //-5, -5, 3

    glMatrix.mat4.lookAt(self.viewMatrix, self.look, [0, 0, 0], [0, 0, 1]);   
    glMatrix.mat4.perspective(
      self.projMatrix,
      glMatrix.glMatrix.toRadian(45),
      self.gl.canvas.clientWidth/self.gl.canvas.clientHeight,
      2,
      1000.0
    );
  }

  Unload() {
  }

  Begin() {
    var gl = this.gl;
    
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.08, 0.12, 0.18, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    console.log(this.program, this.buffer);
    console.log('test');
    console.log(this.program.uniforms);
    console.log(this.worldMatrix);

    gl.useProgram(this.program);

    gl.uniformMatrix4fv(this.program.uniforms.u_World, gl.false, this.worldMatrix);
    gl.uniformMatrix4fv(this.program.uniforms.u_View, gl.false, this.viewMatrix);
    gl.uniformMatrix4fv(this.program.uniforms.u_Proj, gl.false, this.projMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.program.attribs.a_Position);
    gl.vertexAttribPointer(this.program.attribs.a_Position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(this.program.attribs.a_Color);
    gl.vertexAttribPointer(this.program.attribs.a_Color, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  Update() {
  }
  
  Render() {
  }
}
