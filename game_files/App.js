import { Scene } from './Scene.js';

export function InitApp (x, y, z) {
  var canvas = document.getElementById("game-surface");
  
  var gl = canvas.getContext("webgl");

  if (!gl) {
    alert("your browser does not support webgl.");
  }

  var puzzle = new Scene(gl, x, y, z);
  puzzle.Load().then(() => puzzle.Begin());

  return puzzle;
}


