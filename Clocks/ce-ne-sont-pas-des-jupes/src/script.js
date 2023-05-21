/*********
 * made by Matthias Hurrle (@atzedent)
 */

/** @type {HTMLCanvasElement} */
const canvas = window.canvas
const gl = canvas.getContext("webgl2")
const dpr = Math.max(.5, .5*window.devicePixelRatio)
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

#define mouse (touch/resolution)
#define P pointerCount
#define T (20.+mod(time, 180.))
#define S smoothstep
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float rnd(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float ftor(vec3 p, vec3 s, float r) {
  vec2 e = vec2(
    abs(length(p.xz)-s.x-s.z),
    abs(p.y)-s.y
  );

  return length(max(e,.0))+
  min(.0, max(e.x, e.y))-r;
}

float map(vec3 p) {
  const float dst=5.2;
  vec3 s, id, q = p;
  id = (floor(.5+p/dst-.5)-.5);
  q = (fract(.5+p/dst-.5)-.5)*dst;
  s = vec3(1, 1,.25)+(-sin(2.5*(T+length(id)*.2+sin(.2*T+length(id))*.5+.5)+p.y*2.)*.15);
  s = abs(s);
  q.xz *= 1.+cos(atan(q.x, q.z)*12.)*.1;
  float d = 5e5,
  sph = ftor(q, s,.05)*.5;

  d = min(d, sph);

  return d;
}

vec3 norm(vec3 p) {
  vec2 e = vec2(1e-3, 0);
  float d = map(p);
  vec3 n = d-vec3(
    map(p-e.xyy),
    map(p-e.yxy),
    map(p-e.yyx)
  );

  return normalize(n);
}

void tunnel(inout vec3 p) {
  if (P > 0) return;

  p.z += -4.*T;
}

float tick(float t, float e) {
  t/=e;
  return floor(t)+pow(S(.0, 1., fract(t)), e);
}

float tween2(float a) {
  return a*a*a*a*a;
}

float tween3(float x) {
  return x*x*x*(10. + x*(-15. + 6.*x));
}

float getsss(vec3 p, vec3 rd, float dist, float k) {
  float ddist = dist * k;
  return clamp(map(p + rd * dist) / dist, .0, 1.) +
    clamp(map(p + rd * ddist) / ddist, .0, 1.);
}

float getao(vec3 p, vec3 n, float dist) {
  return clamp(map(p + n * dist) / dist, .0, 1.);
}

void cam(inout vec3 p) {
  if (P > 0) {
    p.yz *= rot(-mouse.y*acos(-1.)+acos(.0));
    p.xz *= rot(acos(-1.)-mouse.x*acos(-1.) * 2.);
  } else {
    p.yz *= rot(tween2(cos(T*.2))*.3);
    p.xz *= rot(tween2(sin(T*.2))*3.14159);
    p.xy *= rot(tween3(.5+.5*cos(tick(T,10.)))*.2);
  }
}

void main(void) {
  vec2 uv = (
    gl_FragCoord.xy-.5*resolution.xy
  )/min(resolution.x, resolution.y);

  vec3 col = vec3(0),
  ro = vec3(0, 0, -8.5),
  rd = normalize(vec3(uv, .8));

  cam(ro);
  cam(rd);
  tunnel(ro);

  vec3 p = ro,
  lp = vec3(1, 4.5, 5.-.5*clamp(tween2(cos(T)*.5+.5)*20.+10.,-20.,30.));

  lp.yz *= rot(exp(-cos(T)));
  lp.xz *= rot(T);
  tunnel(lp);

  const float steps = 400., maxd = 35.;
  float dd = .0,
  at = .0;

  for (float i = .0; i < steps; i++) {
    float d = map(p);
    if (d < 1e-3) break;
    if (dd > maxd) {
      dd = maxd;
      break;
    }
    p += rd*d;
    dd += d;
    at += exp(rnd(p.xz+T)-dot(p-lp, p-lp)*.35);
  }

  vec3 n = norm(p),
  l = normalize(lp-p),
  tint = vec3(.95,.9,.8);

  float fog = S(1., .0, max(.0, dd/maxd)),
  diff = clamp(dot(l, n),.0, 1.)*.5+.5,
  fres = pow(S(.0, 1.,max(.0, dot(-rd, n))), 4.),
  fade = (1./dot(p-lp, p-lp)),
  spec = max(.0, dot(n, normalize(lp-p))),
  sss = getsss(l,n,15.,5.),
  ao =
    (getao(p,n,12.)*.5+.5)*
    (getao(p,n,1.)*.3+.7)*
    (getao(p,n,.5));

  col += fog*tint*diff*fres*fade;
  col += fres*pow(spec, 128.)*pow(fade, .8);
  col = mix(col, vec3(.125,.0125,.25), fog*exp(log(diff)));

  col = mix(col, vec3(diff), diff * ao);
  col = mix(col, vec3(sss * .1), S(1.,.0,fog));

  col += vec3(1,.3,.5)*at;

  col = exp(-col*16.);
  col = sqrt(col);
  col = exp(-col*8.);
  
  col += .05*rnd(n.yy);

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
