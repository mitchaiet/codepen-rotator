

////
"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="rgba(0,0,0,0)";
body.style.display="grid";
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=0.9;

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

onresize=function() { 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var Tile=function(p1,p2,p3,p4,i,ts) {
  this.v=[p1,p2,p3,p4];
  this.draw=(f)=>{
    ctx.beginPath();
    ctx.Globalcompositeoperation="overlay";
    ctx.moveTo(this.v[0].x,this.v[0].y);
    ctx.lineTo((1-f)*this.v[1].x+f*this.v[3].x,(1-f)*this.v[1].y+f*this.v[3].y);
    ctx.lineTo(this.v[2].x,this.v[2].y);
    ctx.lineTo((1-f)*this.v[3].x+f*this.v[1].x,(1-f)*this.v[3].y+f*this.v[1].y);       
    ctx.closePath();
    ctx.stroke();
    ctx.Globalcompositeoperation="difference";
  }
}

var colors=[];
var setColors=()=>{
  colors=[];
  let hue=getRandomInt(0,89);
  let hd=getRandomInt(90,270);
  let n=getRandomInt(271,360);
  for (let i=0; i<n; i++) {
    let sat=50+50*Math.random();
    //let lum=60+20*Math.random();
    let lum=60+40*Math.random();
    let lun=0.6+0.4*Math.random();
    colors.push("hsla("+((hue+i*hd)%360)+","+sat+"%,"+lum+"%,"+lun+")");
  }
  (()=>{
    let no=[];
    do {
      no.push(colors.splice(getRandomInt(0,colors.length),1)[0]);
    } while (colors.length>0);
    colors=no;
  })();
}

var TileSet=function(idx) {
  this.tiles=[];
  this.sat=60+40*Math.random();
  this.lum=80+20*Math.random();
  this.idx=idx;
  this.color=colors[idx%colors.length];
  if (sync) {
      this.os=syncM*Math.floor(idx/2);
      this.rate=800;
    } else {
      this.os=0;
      this.rate=200+400*Math.random();
  }

  this.drawTiles=()=>{
    ctx.fillStyle=this.color;
    for (let tile of this.tiles) {
      let f=(1+Math.tan(this.os+TP*t/this.rate))/2;
      
      tile.draw(f);
      ctx.fill();
    }
  }
}

var W=2; // layers+1
var C=4; // radials
var pts=[]
var tileSets=[];
var setTileSets=()=>{
  tileSets=[];
  for (let ts=0; ts<2*(W-1); ts++) tileSets.push(new TileSet(ts));
}

var randomizeF=()=>{
  let S=[-1,1][getRandomInt(0,2)];
  C=2*(10+S*getRandomInt(0,10,true)); // radials
  let b=Math.floor(C/3);
  S=[-1,1][getRandomInt(0,2)];
  if (b<2) {
    W==4;
  } else {
    W=b+S*getRandomInt(0,b-2,true);
  }
  W=Math.min(27,W);
}

var setPoints=()=>{
  pts=[];
  let q=1/(4*C);
  for (let c=0; c<C; c++) {
    let o=c*TP/C; 
    
    for (let r=-W; r<W; r++) {
      let Z=TP*q*Math.sin(r*TP/4)+o;
      let r2=Math.atan(r*TP/(4*W));
      let x=r2*CSIZE*Math.cos(Z);
      let y=r2*CSIZE*Math.sin(Z);
      pts.push({"x":x,"y":y});
    }
  }
}

var generateSlots=(te)=>{
  let a=[], w=[];
  for (let i=0; i<30; i++) { w.unshift(te[i%4]); a.push(w.slice()); }
  return a;
}
var pr=generateSlots([0,0,1,1]);
var di=generateSlots([0,1,1,0]);

var setTiles=(v)=>{
  setPoints();
  setColors();
  setTileSets();
  let pointCount=2*C*W;
  for (let l=0, i=0; l<W-1; l++) {
    for (let c=0; c<C; c++,i++) {
      let prox=(c+pr[W-2][l])*2*W+l;
      if (prox>=pointCount) prox=prox-pointCount;
      let s1=c*2*W+l+1;
      let s2=(c+1)*2*W+l+1;
      if (s2>=pointCount) s2=s2-pointCount;
      let dist=(c+di[W-2][l])*2*W+l+2;
      if (dist>=pointCount) dist=dist-pointCount;
      tileSets[2*l+c%2].tiles.push(new Tile(
        pts[prox],
        pts[1+c*2*W+l],
        pts[dist],
        pts[s2],
        i, tileSets[2*l+c%2]
      ));
    }
  }
}

var draw=()=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let ts of tileSets) ts.drawTiles();
  ctx.fillStyle="hsla(0,0%,100%,"+O+")";
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
}

var sync=true;
var syncM=-10*getRandomInt(1,10);
var transit=()=>{
  randomizeF();
  sync=Math.random()<0.5
  syncM=10*getRandomInt(1,10);
  setTiles();
}

var O=0;
var t=0;
var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
  if (t<500) {
    O=Math.max(0.05,O-=0.01);
  } else if (t>700) {
    O=Math.min(1,O+=0.01);
    if (t==780) {
      transit();
      t=0;
    }
  }
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
transit();
start();


///
CSS.paintWorklet.addModule('https://pshihn.github.io/rough-paint/dist/rough-painter.bundled.js');