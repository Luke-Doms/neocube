import {CreateModel} from './lib/utils/CreateModel.js';
import { GetShaderText , CreateShaderProgram } from './lib/utils/CreateProgram.js';
import { ObjParser } from './lib/utils/ObjParser.js';
import * as glMatrix from './lib/utils/gl-matrix-min.js';
import { CreatePuzzleModel } from './lib/utils/CreatePuzzleModel.js';
import { Camera } from './lib/utils/Camera.js';
import { CheckIntersection } from './lib/utils/CheckIntersection.js';
import { GetRotationAxis } from './lib/utils/GetRotationAxis.js';
import { ApplyRotation } from './lib/utils/ApplyRotation.js';

export class Scene {
  constructor (gl, x, y, z) {
    this.gl = gl;
    this.x = x;
    this.y = y;
    this.z = z;

    //writing methods in the constructor like this creates a copy for each instance of the class which is memory intensive, 
    //possible change approach if in final app this becomes too sluggish with multiple puzzles open.
    this.Load = async () => {
      this.program;
      this.puzzleModel;
      this.viewMatrix;
      this.projMatrix;
      this.look;
      this.eye = new Camera([10, 10, 10], [0, 0, 1]);
      this.faceSelected = false;

      const modelText = await GetShaderText('game_files/lib/models/BaseCube.obj');

      const cubieModel = new Float32Array(ObjParser(modelText));

      this.puzzleModel = CreatePuzzleModel(this.gl, cubieModel, this.x, this.y, this.z);


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
      this.look = glMatrix.vec3.fromValues(20, 20, 20);    //-5, -5, 3

      glMatrix.mat4.lookAt(this.viewMatrix, this.eye.pos, [0, 0, 0], this.eye.up);   
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

      const OnMouseMove = (event) => {
        if (!this.faceSelected) {
          this.eye.Move(this.gl, event, this.viewMatrix, this.projMatrix);
        }
      }

      const TestRotation = () => {
        for (var i in this.puzzleModel) {
          if (this.puzzleModel[i].center.x > -1 && this.puzzleModel[i].center.x < 1) { //only works for odd number of cubies on x axis
            const angle = glMatrix.glMatrix.toRadian(90);
            const axis = [1, 0, 0];
            glMatrix.mat4.rotate(this.puzzleModel[i].worldMatrix, this.puzzleModel[i].worldMatrix, angle, axis);
          }
        }
      }

      window.addEventListener("mousedown", (event) => {
        this.faceSelected = CheckIntersection(this.gl, event, this.puzzleModel, this.eye.pos, this.projMatrix, this.viewMatrix); //boolean value
        this.eye.initialMouseEvent = event;
        window.addEventListener("mousemove", OnMouseMove);
      });

      window.addEventListener("mouseup", (event) => {
        window.removeEventListener("mousemove", OnMouseMove);
        if (this.faceSelected) {
          const rotationAxis = GetRotationAxis(this.gl, this.faceSelected, event, this.eye.pos, this.projMatrix, this.viewMatrix);
          ApplyRotation(this.gl, rotationAxis, this.faceSelected, this.puzzleModel, [this.x, this.y, this.z]);
        }
        this.faceSelected = false;
      });

      window.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
          event.preventDefault();
          TestRotation();
        }
      });

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
      if (this.eye.update) {
        glMatrix.mat4.lookAt(this.viewMatrix, this.eye.pos, [0, 0, 0], this.eye.up);
      }
    }

    this.Render = () => {
      var gl = this.gl;
      
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(127.5/255, 127.5/255, 127.5/255, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(this.program);

      gl.uniformMatrix4fv(this.program.uniforms.u_View, gl.false, this.viewMatrix);
      gl.uniformMatrix4fv(this.program.uniforms.u_Proj, gl.false, this.projMatrix);

      for (var i in this.puzzleModel) {
        gl.uniformMatrix4fv(this.program.uniforms.u_World, gl.false, this.puzzleModel[i].worldMatrix);
        const cubieBuffer = this.puzzleModel[i].buffer_id;
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
