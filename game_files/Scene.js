import {CreateModel} from './lib/utils/CreateModel.js';
import { GetShaderText , CreateShaderProgram } from './lib/utils/CreateProgram.js';
import * as vec3 from '/node_modules/gl-matrix/gl-matrix.js';
import * as mat4 from '/node_modules/gl-matrix/gl-matrix.js';
import { ObjParser } from './lib/utils/ObjParser.js';
import { CreatePuzzleModel } from './lib/utils/CreatePuzzleModel.js';

export class Scene {
  constructor (gl, dimensions) {
    this.gl = gl;
    this.dims = dimensions;

    //writing methods in the constructor like this creates a copy for each instance of the class which is memory intensive, 
    //possible change approach if in final app this becomes too sluggish with multiple puzzles open.
    this.Load = async () => {
      this.program;
      this.puzzleModel;
      this.viewMatrix;
      this.projMatrix;
      this.look;

      const modelText = await GetShaderText('game_files/lib/models/BaseCube.obj');

      const cubieModel = new Float32Array(ObjParser(modelText));

      this.puzzleModel = CreatePuzzleModel(this.gl, cubieModel, 3, 3, 3);


      const vertexShaderText = await GetShaderText('game_files/lib/shaders/VertexShader.glsl');
      const fragmentShaderText = await GetShaderText('game_files/lib/shaders/FragmentShader.glsl');

      this.program = CreateShaderProgram(this.gl, vertexShaderText, fragmentShaderText);

      this.program.uniforms = {
        u_Proj: this.gl.getUniformLocation(this.program, 'u_Proj'),
        u_View: this.gl.getUniformLocation(this.program, 'u_View'),
        u_World: this.gl.getUniformLocation(this.program, 'u_World'),
      };

      this.program.attribs = {
        a_Position: this.gl.getAttribLocation(this.program, 'a_Position'),
        a_Color: this.gl.getAttribLocation(this.program, 'a_Color'),
      };

      this.viewMatrix = glMatrix.mat4.create();
      this.projMatrix = glMatrix.mat4.create();
      this.worldMatrix = glMatrix.mat4.create();
      this.look = glMatrix.vec3.fromValues(0, 5, 5);    //-5, -5, 3

      glMatrix.mat4.lookAt(this.viewMatrix, this.look, [0, 0, 0], [0, 0, 1]);   
      glMatrix.mat4.perspective(
        this.projMatrix,
        glMatrix.glMatrix.toRadian(45),
        this.gl.canvas.clientWidth/this.gl.canvas.clientHeight,
        2,
        1000.0
      );
    }

    this.Unload = () => {
    }

    this.Begin = () => {
      this.startTime = 0;
      var previousFrameTime = performance.now();
      var dt;
      const loop = (currentFrameTime) => {
        dt = currentFrameTime - previousFrameTime;
        previousFrameTime = currentFrameTime;

        this.Update(dt);
        this.Render();

        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }

    this.Update = (dt) => {
      var seconds = dt / 1000;
      this.startTime = this.startTime + seconds;
      this.look = glMatrix.vec3.fromValues(15*Math.sin(this.startTime), 15*Math.cos(this.startTime), 5);
      glMatrix.mat4.lookAt(this.viewMatrix, this.look, [0, 0, 0], [0, 0, 1]);   
    }

    this.Render = () => {
      var gl = this.gl;
      
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(127.5/255, 127.5/255, 127.5/255, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(this.program);

      gl.uniformMatrix4fv(this.program.uniforms.u_World, gl.false, this.worldMatrix);
      gl.uniformMatrix4fv(this.program.uniforms.u_View, gl.false, this.viewMatrix);
      gl.uniformMatrix4fv(this.program.uniforms.u_Proj, gl.false, this.projMatrix);

      for (var i in this.puzzleModel) {
        const cubieBuffer = this.puzzleModel[i];
        gl.bindBuffer(gl.ARRAY_BUFFER, cubieBuffer);
        gl.enableVertexAttribArray(this.program.attribs.a_Position);
        gl.vertexAttribPointer(this.program.attribs.a_Position, 3, gl.FLOAT, false, 11 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(this.program.attribs.a_Color);
        gl.vertexAttribPointer(this.program.attribs.a_Color, 3, gl.FLOAT, false, 11 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
      }
    }
  }
}
