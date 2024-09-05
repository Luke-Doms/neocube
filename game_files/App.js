var puzzle;

export var initApp = function (dimensions) {
  var canvas = document.getElementById("gameSurface");
  
  var gl = canvas.getContext("webgl");

  if (!gl) {
    alert("your browser does not support webgl.");
  }
  puzzle = new Scene(gl, dimensions);
  puzzle.Load().then(() => puzzle.Begin());
}


