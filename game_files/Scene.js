import {CreateModel} from './lib/utils/CreateModel.js';

export class Scene {
  constructor (gl, dimensions) {
    this.gl = gl;
    this.dims = dimensions;
  }

  Load() {
    const triangle = new Float32Array([1, 0, 0, 1, 0, 0, 
                                       0, 1, 0, 0, 1, 0, 
                                       0, 0, 1, 0, 0, 1]);
  }

  Unload() {
  }

  Begin() {
  }

  Update() {
  }
  
  Render() {
  }
}
