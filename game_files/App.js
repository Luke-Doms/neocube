var puzzle;

export var initApp = function () {
  var canvas = document.getElementById("gameSurface");
  
  var gl = canvas.getContext("webgl");

  if (!gl) {
    alert("your browser does not support webgl.");
  }
  puzzle = new puzzleScene(gl);
  puzzle.Load().then(() => puzzle.Begin());
}


