class Shape{
  constructor(){
    this.x = random(width);
    this.y = random(height);
    this.dir = random(PI*2);
    this.a = random(PI*2);
    this.spin = random(.01, .02)*(random() < .5 ? -1 : 1);
    this.speed = random(.5, 1);
    this.size = random(50, 100);
    this.hue = random();
    this.sat = random(.5, .9);
    
    //neat little trick found here: https://gist.github.com/amfg/e007f5ee0e3d2d981897
    this.text = String.fromCharCode(window.crypto.getRandomValues(new Uint16Array(1)));
    this.delete = false;
  }
  update(){
    this.a += this.spin;
    this.x += cos(this.dir)*this.speed;
    this.y += sin(this.dir)*this.speed;
    this.delete = this.x < 0 || this.y < 0 || this.x > width || this.y > height;
  }
  render(){
    push();
    noFill();
    stroke(this.hue, this.sat, 1, .02);
    translate(this.x, this.y);
    rotate(this.a);
    textSize(this.size);
    text(this.text, 0, 0);
    pop();
  }
}

function setup (){
  pixelDensity(1);
  createCanvas();
  colorMode(HSB, 1, 1, 1);
  windowResized();
}

let shapes, n;
let init = () => {
  shapes = [];
  textAlign(CENTER, CENTER);
  blendMode(NORMAL);
  background(0);
  blendMode(ADD);
  n = 0;
}

function draw(){
  if (n < 50 && random() < .05){
    shapes.push(new Shape());
    n++;
  }
  for (let s of shapes){
    s.update();
    s.render();
  }
  shapes = shapes.filter(s => !s.delete);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  init();
}

function mouseClicked(){
  init();
}