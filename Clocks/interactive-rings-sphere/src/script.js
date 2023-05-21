const stage = document.querySelector('#stage'),
      nPaths = 50,
      rad = 550

// create sphere of rings
for (let i=0; i<nPaths; i++){
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
  stage.appendChild(circle)
  gsap.set(circle, {
    attr:{
      fill:'none',
      stroke:'hsl('+(145+i/nPaths*200)+',100%,50%)',//'#000',
      'stroke-width':.6,
      // 'stroke-dasharray':'1 4',
      cx:400,
      cy:gsap.utils.interpolate(400-rad/3,400+rad/3,i/nPaths),
      r:gsap.utils.interpolate(rad/nPaths, rad, gsap.utils.wrapYoyo(0,0.5,i/(nPaths-1)))
    },
    svgOrigin:'400 400',
    opacity:gsap.utils.interpolate(0, 3, gsap.utils.wrapYoyo(0,0.5,i/(nPaths-1)))
  })
}

// looping timeline
const tl = gsap.timeline({paused:true}).from('circle', {
  attr:{
    stroke:(i,t,a)=> (i==a.length-1)?'+=0':gsap.getProperty(a[i+1],'stroke'),
    cy:(i,t,a)=> (i==a.length-1)?'+=0':gsap.getProperty(a[i+1],'cy'),
    r:(i,t,a)=> (i==a.length-1)?'+=0':gsap.getProperty(a[i+1],'r')
  },
  opacity:(i,t,a)=> (i==a.length-1)?0:gsap.getProperty(a[i+1],'opacity'),
  ease:'none',
  repeat:Math.floor(nPaths/4)
})

// interaction
window.onpointermove = (e)=>{
  gsap.to('circle', {
    rotate:gsap.utils.interpolate(-15, 15, e.x/innerWidth)
  })
  gsap.to(tl, {progress:e.y/innerHeight, overwrite:true})
}

//intro build
gsap.to(tl, {progress:1, duration:4})
gsap.from(stage, {opacity:0, scale:0.5, transformOrigin:'50%', duration:4, ease:'expo'})
