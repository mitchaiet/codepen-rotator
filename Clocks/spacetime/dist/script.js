// cone loop + turbulence filter
gsap.timeline({defaults:{ ease:'none', repeat:-1 }})
  .from('.cone ellipse', {
    duration:1,
    attr:{
      cx:(i,t,a)=> (i==a.length-1)?'+=0':gsap.getProperty(a[i+1],'cx'),
      cy:(i,t,a)=> (i==a.length-1)?'+=0':gsap.getProperty(a[i+1],'cy'),
      rx:(i,t,a)=> (i==a.length-1)?'+=0':gsap.getProperty(a[i+1],'rx'),
      ry:(i,t,a)=> (i==a.length-1)?'+=0':gsap.getProperty(a[i+1],'ry')
    }
  }, 0)
  .to(window, {
    duration:0.3,
    onRepeat:()=> gsap.set('feTurbulence', { attr:{seed:'random(1,99)'} })
  }, 0)


//dust + scratches
for (let i=0; i<13; i++){
  let d = document.createElement('div')
  document.querySelector('.grain').appendChild(d)
  gsap.set(d, {
    attr:{ class:'d' },
    position:'absolute',
    width:30,
    height:30,
    backgroundImage:'url(https://assets.codepen.io/721952/filmDust.png)',
    backgroundPosition:'0 -'+gsap.utils.wrap(0,8,i)*30+'px'
  })
}

gsap.timeline({ repeatRefresh:true, repeat:-1 })
  .set('.d', {
    x:()=> innerWidth*1.5*Math.random(),
    y:()=> innerHeight*1.5*Math.random(),
    rotation:()=> 'random(0,360)',
    scale:()=> 'random(0.3,0.8)'
  }, 0.08)