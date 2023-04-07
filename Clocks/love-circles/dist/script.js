gsap.config({trialWarn: false});
console.clear()
let select = s => document.querySelector(s),
		q = gsap.utils.selector(document),
		toArray = s => gsap.utils.toArray(s),
		canvas = select('#canvas'),
		ctx = canvas.getContext('2d'),
		particles = [],
		sizeObj = {width: window.innerWidth,
							 height: window.innerHeight
							},
		lineArray = [],
		allLines = toArray('#concentric path'),
		resolution = Math.min(window.devicePixelRatio || 1, 2),
		colorArray =["ff595e","ffca3a","8ac926","279af1","6a4c93"]
		//colorArray =["FBDAE2","F5A3B6","EF6C8B","E9355E","CA1640", "A51235", "810E29"].reverse()

CustomEase.create("custom", "M0,0 C0.452,0.004 0.336,0.254 0.388,0.502 0.456,0.832 0.822,1 1,1 ");

colorArray = colorArray.map(x => {
	let color = Array.from(x)[0] == '#' ? x : `#${x}`;
	return color
})
function convertToRadians(degree) {
	return degree*(Math.PI/180);
}
class Particle {
  constructor(x, y, r, color) {
		
   	this.x = x;
   	this.y = y;
   	this.r = r;
   	this.color = color;
    }
  
}
class SVGParticle {
  constructor(x, y, scale, rotation, svgPath, lineWidth,  strokeStyle, fillStyle, globalAlpha, shadowColor, id, direction) {
		const bbox = svgPath.getBBox();
		const $ = this;
   	$.x = x;
   	$.y = y;
   	$.scale = scale;
   	$.rotation = rotation;
   	//$.node = svgPath;
   	$.pathData = svgPath.getAttribute('d');
   	$.pathLength = svgPath.getTotalLength().toFixed(2);
		//console.log($.pathLength)
		$.pathOffset = $.pathLength;
		$.pathPercent = 0;
		
		$.lineWidth = lineWidth;
		$.globalAlpha = globalAlpha;
		$.strokeStyle = strokeStyle;
		//console.log(strokeStyle)
		$.fillStyle = fillStyle;
		$.shadowColor = shadowColor;
		$.id = id;
		$.direction = direction;
    $.width = bbox.width;
    $.height = bbox.height;
    $.halfWidth = (bbox.width) / 2;
    $.halfHeight = (bbox.height) / 2;	
		//console.log($)
  }
  
}

allLines.forEach((c, i) => {
	let color = gsap.utils.wrapYoyo(colorArray, i);
	let line = new SVGParticle(0,0, 1, 0, c, c.parentNode.getAttribute('stroke-width'), color, null, 1, null);
	lineArray.push(line);
})


function draw() {
	
	ctx.globalCompositeOperation = "destination-over";;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	lineArray.forEach((myPath, i) => {
		
		ctx.save();
		let drawPath = new Path2D(myPath.pathData);
		//ctx.translate(myPath.x+myPath.width, myPath.y + myPath.height);
		//lineArray[lineArray.length-1].width
		ctx.lineCap = "round";
		ctx.translate((sizeObj.width/2)-lineArray[lineArray.length-1].halfWidth, (sizeObj.height/2) - lineArray[lineArray.length-1].halfHeight)
		let arr = [myPath.pathLength - myPath.pathOffset, myPath.pathOffset];
		ctx.lineDashOffset = myPath.pathPercent;

		ctx.setLineDash(arr);  //return
		ctx.stroke(drawPath)
		ctx.restore();

		ctx.strokeStyle = myPath.strokeStyle;
		ctx.fillStyle = null;	
		ctx.lineWidth = myPath.lineWidth;

		//ctx.globalCompositeOperation = "lighter";
	})
	

}

window.onresize = function (e) {

	sizeObj.width = window.innerWidth;
	sizeObj.height = window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
}
window.onresize() ;
//return


gsap.ticker.add(draw)
//return
gsap.timeline().set(lineArray, {
	direction: 1
})
.to(lineArray, {
	pathOffset: (i, c) => -(c.pathPercent / c.pathLength),
	pathPercent: (i, c) => c.pathLength/2,
	stagger: {
		amount: 1.6,
		repeat: -1,
		yoyoEase: 'custom'
	},
	rotation: 360,
	ease: 'custom',
	duration:1
}).seek(100)
/*  .to(lineArray, {
	pathOffset: (i, c) => 0,
	stagger: {
		amount: 3,
		repeat: -1,
		yoyo: true
	},
	ease: 'sine.inOut',
	duration: 2
}, '-=1.5')  */