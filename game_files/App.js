import { Scene } from './Scene.js';

var puzzle;

export function initApp (x, y, z) {
  var canvas = document.getElementById("game-surface");
  
  var gl = canvas.getContext("webgl");

  if (!gl) {
    alert("your browser does not support webgl.");
  }

  puzzle = new Scene(gl, x, y, z);
  puzzle.Load().then(() => puzzle.Begin());
}


