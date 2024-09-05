precision mediump float;

attribute vec3 a_Position;
attribute vec3 a_Color;
uniform mat4 u_World;
uniform mat4 u_View;
uniform mat4 u_Proj;

varying vec3 v_Color;
void main()
{
  v_Color = a_Color;
  gl_Position = u_Proj * u_View * u_World * vec4(a_Position, 1.0);
}

