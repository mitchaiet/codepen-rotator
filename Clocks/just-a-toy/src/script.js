/*********
 * made by Matthias Hurrle (@atzedent)
 */

/** @type {HTMLCanvasElement} */
const canvas = window.canvas
const gl = canvas.getContext("webgl2")
const dpr = Math.max(1, .5*window.devicePixelRatio)
/** @type {Map<string,PointerEvent>} */
const touches = new Map()

const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

in vec2 position;

void main(void) {
    gl_Position = vec4(position, 0., 1.);
}
`
const fragmentSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

out vec4 fragColor;

uniform vec2 resolution;
uniform vec2 touch;
uniform float time;
uniform int pointerCount;

#define PI 3.14159
#define TAU 6.28318

#define S smoothstep
#define T time
#define mouse (touch / resolution)
#define syl(p,s) (length(p)-s)

float rnd(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

mat3 rotX(float a) {
  float s = sin(a), c = cos(a);

  return mat3(vec3(1, 0, 0), vec3(0, c, -s), vec3(0, s, c));
}

mat3 rotY(float a) {
  float s = sin(a), c = cos(a);

  return mat3(vec3(c, 0, s), vec3(0, 1, 0), vec3(-s, 0, c));
}

mat3 rotZ(float a) {
  float s = sin(a), c = cos(a);

  return mat3(vec3(c, s, 0), vec3(-s, c, 0), vec3(0, 0, 1));
}

float ftor(vec3 p, vec3 s, float r) {
  vec2 e = vec2(
    abs(length(p.xz)-s.x)-s.z,
    abs(p.y)-s.y
  );

  return length(max(e,.0))+
  min(.0, max(e.x, e.y))-r;
}

float mat = 0.;
float map(vec3 p) {
  float bkg = -syl(p, 10.);
  float d = 5e5;
  vec3 q = p;
  q.y += sin(T + 1.) * 1.75;
  q *= rotZ(T) * rotY(T) * rotX(T);
  d = min(d, ftor(q, vec3(3.5, .25, .25), .05));
  q.y += sin(T + .5) * 1.5;
  q *= rotY(T) * rotX(T);
  d = min(d, ftor(q, vec3(2.75, .25, .25), .05));
  q *= rotX(T);
  d = min(d, ftor(q, vec3(2., .25, .25), .05));
  float sph = syl(q, 1.);
  d = min(d, min(sph, bkg));

  if(d == bkg)
    mat = 1.;
  else if(d == sph)
    mat = .0;
  else
    mat = 2.;

  return d;
}

vec3 norm(vec3 p) {
  vec2 e = vec2(1e-3, 0);
  float d = map(p);
  vec3 n = d - vec3(
    map(p - e.xyy),
    map(p - e.yxy),
    map(p - e.yyx)
  );

  return normalize(n);
}

vec3 dir(vec2 uv, vec3 ro, vec3 t, float z) {
  vec3 up = vec3(0, 1, 0),
  f = normalize(t - ro),
  r = normalize(cross(up, f)),
  u = cross(f, r),
  c = f * z,
  i = c + uv.x * r + uv.y * u,
  d = normalize(i);

  return d;
}

void main(void) {
  float
  mn = min(resolution.x, resolution.y),
  mx = max(resolution.x, resolution.y);
  vec2 uv = (
    gl_FragCoord.xy - .5 * resolution.xy
  ) / mn;

  vec3
  col = vec3(0),
  ro = vec3(0, 5, -8);

  if(pointerCount > 0) {
    ro *= rotX(-mouse.y * PI + 1.);
    ro *= rotY(mouse.x * TAU);
  } else {
    ro *= rotY(T * .1) * rotX(-T * .1);
  }

  vec3
  rd = dir(uv, ro, vec3(0), 1.),
  p, l, n, r;

  float
  d = .0,
  dither = mix(.98, 1., rnd(uv));

  const float steps = 80.;

  for(float i; i < steps; i++) {
    p = ro + rd * d;
    d += map(p);

    if(d < 1e-3) {
      break;
    }
  }

  n = norm(p) * dither;
  l = normalize(ro);

  col += .5 * pow(dot(l, n) * .5 + .5, 4.);

  if(mat == .0) {
    
    p /= d;
    float pattern = S(.0, 1. / mx, sin(60. * p.y));

    col *= abs(vec3(2, 1, 1) * pattern);
    col += abs(vec3(1) * (1. - pattern)) * (pow(S(1., .0, d / 40.), .5) * max(.0, dot(l, n)));
    col *= .75;

  } else if(mat == 2.) {

    r = rd;
    vec3
    h = normalize(l - r),
    tint = vec3(1, 0, 0);
    
    float
    fres = pow(1. - max(.0, dot(n, -r)), 3.),
    dnh = max(.0, dot(n, h));

    col += max(.0, dot(n, l)) * (.2 * fres + .4 * pow(dnh, 7.) + 3. * pow(dnh, 30.)) * tint * 30. / (d * d);
    col *= vec3(d * .1, 0, 0);

  }

  col += .125 * length(uv);
  col = S(.0, 1., col);
  col = S(.0, 1., col);
  col = exp(-col * 8.);
  col = sqrt(col);
  col = exp(-col * 4.);

  fragColor = vec4(col, 1);
}
`
let time
let buffer
let program
let touch
let resolution
let pointerCount
let vertices = []
let touching = false

function resize() {
    const { innerWidth: width, innerHeight: height } = window

    canvas.width = width * dpr
    canvas.height = height * dpr

    gl.viewport(0, 0, width * dpr, height * dpr)
}

function compile(shader, source) {
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
    }
}

function setup() {
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)

    program = gl.createProgram()

    compile(vs, vertexSource)
    compile(fs, fragmentSource)

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
    }

    vertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]

    buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, "position")

    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    time = gl.getUniformLocation(program, "time")
    touch = gl.getUniformLocation(program, "touch")
    pointerCount = gl.getUniformLocation(program, "pointerCount")
    resolution = gl.getUniformLocation(program, "resolution")
}

function draw(now) {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    gl.uniform1f(time, now * 0.001)
    gl.uniform2f(touch, ...getTouches())
    gl.uniform1i(pointerCount, touches.size)
    gl.uniform2f(resolution, canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5)
}

function getTouches() {
    if (!touches.size) {
        return [0, 0]
    }

    for (let [id, t] of touches) {
        const result = [dpr * t.clientX, dpr * (innerHeight - t.clientY)]

        return result
    }
}

function loop(now) {
    draw(now)
    requestAnimationFrame(loop)
}

function init() {
    setup()
    resize()
    loop(0)
}

document.body.onload = init
window.onresize = resize
canvas.onpointerdown = e => {
    touching = true
    touches.set(e.pointerId, e)
}
canvas.onpointermove = e => {
    if (!touching) return
    touches.set(e.pointerId, e)
}
canvas.onpointerup = e => {
    touching = false
    touches.clear()
}
canvas.onpointerout = e => {
    touching = false
    touches.clear()
}
