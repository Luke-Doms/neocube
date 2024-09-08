import { Scene } from './Scene.js';

var puzzle;

export function initApp (dimensions) {
  var canvas = document.getElementById("game-surface");
  
  var gl = canvas.getContext("webgl");

  if (!gl) {
    alert("your browser does not support webgl.");
  }

  puzzle = new Scene(gl, dimensions);
  puzzle.Load().then(() => puzzle.Begin());
}


