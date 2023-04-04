let canvas = document.getElementById("myCanvas");

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let c = canvas.getContext('2d');

let colors = ["#A020F0", "#5CACEE", "#0FDDAF","#00688B"];

function Circle(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.radius = r;
  this.startX = x - 15;
  this.endX = x +  15;
  this.startY = y - 15;
  this.endY = y + 15;
  this.dx = Math.random() - 0.5;
  this.dy =Math.random() - 0.5;
  
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle= color;
    c.fill();
  }
  
  this.update = function () {
    
    console.log("x" , this.x);
     console.log("endX" , this.endX);
    
      if(this.x == this.endX || this.y == this.endY) {
         this.dx = -this.dx;
         this.dy = -this.dy;
        
      }
      
      if (this.x == this.startX || this.y == this.startY) {
         this.dx = -this.dx;
         this.dy = -this.dy;
      }
    
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

let circlesArray = [];

for( let i = 0; i < 150; i++) {
  let x = Math.random() * width ;
  let y = Math.random() * height;
  let r = Math.random() * 10;
  let i = Math.floor(Math.random() * colors.length);
  
  let circle = new Circle(x, y, r, colors[i]);
  
  circlesArray.push(circle);
  
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0,0, innerWidth, innerHeight);
  
  for(let circle of circlesArray) {
    circle.update();
  }
}

animate();