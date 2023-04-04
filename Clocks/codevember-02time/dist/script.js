class Clock {
  constructor(startTime) {
    this.t = 0;

    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;

    this.startS = 0;
    this.startM = 0;
    this.startH = 0;

    this.setStartTime(startTime);
  }

  setStartTime(ms) {
    if (ms) {
      this.t = ms / 1000;
      const { s, m, h } = convertTime(this.t);

      this.startS = s;
      this.startM = m;
      this.startH = h;
    } else {
      this.startS = randInt(0, 60);
      this.startM = randInt(0, 60);
      this.startH = randInt(0, 12);
      this.t = this.startS + this.startM * 60 + this.startH * 3600;
    }

    this.seconds = this.startS;
    this.minutes = this.startM;
    this.hours = this.startH;
  }

  update(dt) {
    const nextSecond = (this.startS + convertTime(dt / 1000).s) % 60;

    if (nextSecond === this.seconds) return;

    this.t++;
    let { s, m, h } = convertTime(this.t);

    this.seconds = s;
    this.minutes = m;
    this.hours = h;
  }}


function randInt(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

function convertTime(t) {
  return {
    s: Math.floor(t % 60),
    m: Math.floor(t / 60) % 60,
    h: Math.floor(t / 3600) % 12 + 1 };

}

class Masonry {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.squareSize = 50;
    this.elements = [];
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
    this.squareSize = 0.06 * h;
    this.elements = [];
    this.populate();
  }

  populate() {
    let y = 0;
    let x = 0;

    while (y < this.height) {
      x = 0;

      while (x < this.width) {
        let n = randInt(2, 4);
        const size = n * this.squareSize;
        let margin = 0;
        let nextX = x;
        let nextY = y;

        if (n === 2) {
          margin = randInt(0, 2) * this.squareSize;
          nextY += margin;
        }

        if (n === 3) {
          margin = randInt(0, 2) * this.squareSize;
          nextX += margin;
        }

        this.elements.push({
          x: nextX,
          y: nextY,
          size });


        x = nextX + size;
      }

      y += 3 * this.squareSize;
    }
  }}



const PI2 = 2 * Math.PI;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const center = { x: 0, y: 0 };
let radius = 0.37 * canvas.height;
let lastUpdate = Date.now();
const clocks = [];
const masonry = new Masonry();

resize();
window.addEventListener('resize', resize);
window.requestAnimationFrame(animate);

const mainClock = new Clock(lastUpdate);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = 0.5 * canvas.width;
  center.y = 0.5 * canvas.height;
  radius = 0.37 * canvas.height;
  masonry.setSize(canvas.width, canvas.height);
  masonry.elements.forEach(el => {
    clocks.push(new Clock());
  });
}


function animate() {
  window.requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let now = Date.now();
  let dt = now - lastUpdate;

  masonry.elements.forEach((el, i) => {
    clocks[i].update(dt);
    const { x, y, size } = el;
    renderClock(clocks[i], x, y, size * 0.8);
  });

  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  mainClock.update(dt);
  renderClock(mainClock, center.x, center.y, radius);
}

function renderClock(clock, x, y, r) {
  ctx.save();
  // Rotate because 0*PI is 3h
  ctx.translate(x, y);
  ctx.rotate(-0.5 * Math.PI);
  ctx.translate(-x, -y);

  // Out border
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.lineWidth = 0.1 * r;
  ctx.arc(x, y, r, 0, PI2, false);
  ctx.fill();
  ctx.stroke();

  // Hour hand
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineCap = 'round';
  ctx.lineWidth = 0.05 * r;
  ctx.moveTo(x, y);
  ctx.lineTo(
  x + 0.6 * r * Math.cos(clock.hours * PI2 / 12),
  y + 0.6 * r * Math.sin(clock.hours * PI2 / 12));

  ctx.stroke();

  // Minute hand
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineCap = 'round';
  ctx.lineWidth = 0.05 * r;
  ctx.moveTo(x, y);
  ctx.lineTo(
  x + 0.83 * r * Math.cos(clock.minutes * PI2 / 60),
  y + 0.83 * r * Math.sin(clock.minutes * PI2 / 60));

  ctx.stroke();

  // Second hand
  ctx.beginPath();
  ctx.strokeStyle = 'red';
  ctx.lineCap = 'round';
  ctx.lineWidth = 0.0167 * r;
  ctx.moveTo(x, y);
  ctx.lineTo(
  x + 0.76 * r * Math.cos(clock.seconds * PI2 / 60),
  y + 0.76 * r * Math.sin(clock.seconds * PI2 / 60));

  ctx.stroke();

  ctx.restore();
}