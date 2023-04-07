gsap.config({trialWarn: false});
let select = s => document.querySelector(s),
		q = gsap.utils.selector(document),
		toArray = s => gsap.utils.toArray(s),
		canvas = select('#canvas'),
		ctx = canvas.getContext('2d'),
		particles = [],
		twoPi = Math.PI * 2,
		dotSize = 260,
		minDotSize = dotSize-(dotSize * 0.3),
		sizeObj = {windowWidth: window.innerWidth,
							 windowHeight: window.innerHeight
							},
		particleArray = [],
		colorArray = ["#4390D1","#F4E073","#1D1550","#DF1F3C","#47B081","#699D36","#EC93D1","#E4CC98","#D8BF30","#EE38A8", '#877788',"#364C62", "#F1C40F", "#E67E22", "#E74C3C", "#ECF0F1", "#95A5A6", "#16A085", "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12", "#D35400", "#C0392B", "#BDC3C7","#1ABC9C", "#2ECC71", "#E87AC2", "#3498DB", "#9B59B6", "#7F8C8D"];

	var palette = [];
class Particle {
  constructor(x1, y1, r1, x2, y2, r2, colorStop1, colorStop2) {
   	this.x1 = x1;
   	this.y1 = y1;
		this.r1 = r1;
   	this.x2 = x2;
   	this.y2 = y2;
		this.r2 = r2;
		this.colorStop1 = colorStop1;
		this.colorStop2 = colorStop2;
  }
  
}

colorArray.forEach((c, i) => {
	let x = gsap.utils.random(0, window.innerWidth);
	let y = gsap.utils.random(0, window.innerHeight);
	let p = new Particle(x, y, dotSize, x, y , minDotSize, 'rgba(255,252,249,0)' , c);
	
	particleArray.push(p);
	
		let radius = gsap.utils.random(30, 50);
	
		gsap.set(p, {
			r1: minDotSize,
			r2: dotSize
		});  		
		gsap.to(p,  {
			duration: 'random(3, 6)',
			x1: "+=" + twoPi,
			x2: "+=" + twoPi,
			repeat: -1,
			modifiers: {
				x1:x => (sizeObj.windowWidth/2) + (Math.cos(x) * radius),
				x2:x => (sizeObj.windowWidth/2) + (Math.cos(x) * radius),
			},
				ease: 'none'
		})

  gsap.to(p, {
    duration: 'random(3, 6)',
    y1: "+=" + twoPi,
    y2: "+=" + twoPi,
		repeat: -1,
    modifiers: {
      y1: y => (sizeObj.windowHeight/2) + (Math.sin(y) * radius),
      y2: y => (sizeObj.windowHeight/2) + (Math.sin(y) * radius)
    },
    ease: 'none'
  });  
			
})

function draw() {
	
  ctx.globalCompositeOperation = "source-over";;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	particleArray.forEach((particle, count) => {
		//console.log(count)
		let radGrad = ctx.createRadialGradient(particle.x1,particle.y1,particle.r1,particle.x2,particle.y2,particle.r2);
    radGrad.addColorStop(0, particle.colorStop1);
    radGrad.addColorStop(1, particle.colorStop2);
	
    ctx.fillStyle = radGrad;	
    ctx.fillRect(0,0,canvas.width,canvas.height);		
		ctx.globalCompositeOperation = "lighter";
	})

}

window.onresize = function (e) {
	gsap.set(sizeObj, {
		windowWidth: window.innerWidth,
		windowHeight: window.innerHeight,
	})
	canvas.width = sizeObj.windowWidth;
	canvas.height = sizeObj.windowHeight;
	dotSize = sizeObj.width/30;
}
window.onresize() ;
gsap.ticker.add(draw)
