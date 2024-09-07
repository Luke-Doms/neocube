import {CreateModel} from './lib/utils/CreateModel.js';
import {GetShaderText, CreateProgram} from './lib/utils/CreateProgram';

export class Scene {
  constructor (gl, dimensions) {
    this.gl = gl;
    this.dims = dimensions;
  }

  async Load() {
    var self = this;
    this.program;
    this.buffer;
    this.viewMatrix;
    this.projMatrix;
    this.look;

    const triangle = new Float32Array([1, 0, 0, 1, 0, 0, 
                                       0, 1, 0, 0, 1, 0, 
                                       0, 0, 1, 0, 0, 1]);

    const vertexShaderText = await GetShaderText('game_files/lib/shaders/VertexShader.glsl');
    const fragmentShaderText = await GetShaderText('game_files/lib/shader/FragmentShader.glsl');

    const this.program = CreateProgram(this.gl, vertexShaderText, fragmentShaderText);

    const this.buffer = CreateModel(this.gl, triangle);
    me.program.uniforms = {
      u_Proj: me.gl.getUniformLocation(me.program, 'u_Proj'),
      u_View: me.gl.getUniformLocation(me.program, 'u_View'),
      u_World: me.gl.getUniformLocation(me.program, 'u_World'),
    };

    me.program.attribs = {
      a_Position: me.gl.getAttribLocation(me.Program, 'a_Position'),
      a_Color: me.gl.getAttribLocation(me.Program, 'a_Color'),
    };
  }

  Unload() {
  }

  Begin() {
    var gl = this.gl;
    
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.08, 0.12, 0.18, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(self.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.program.attribs.a_Position);
    gl.vertexAttribPointer(this.program.attributeLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(this.program.attribs.a_Color);
    gl.vertexAttribPointer(this.program.attributeLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  Update() {
  }
  
  Render() {
  }
}
