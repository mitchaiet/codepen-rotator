c = document.querySelector('#c')
c.width = 1920
c.height = 1080
x = c.getContext('2d')
C = Math.cos
S = Math.sin
t = 0
T = Math.tan

rsz=window.onresize=()=>{
  setTimeout(()=>{
    if(document.body.clientWidth > document.body.clientHeight*1.77777778){
      c.style.height = '100vh'
      setTimeout(()=>c.style.width = c.clientHeight*1.77777778+'px',0)
    }else{
      c.style.width = '100vw'
      setTimeout(()=>c.style.height =     c.clientWidth/1.77777778 + 'px',0)
    }
  },0)
}
rsz()

async function Draw(){
  
  if(!t){
    R=(Rl,Pt,Yw,m)=>{
      M=Math
      A=M.atan2
      H=M.hypot
      X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
      Y=C(p)*d
      X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
      Z=C(p)*d
      Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
      Z=C(p)*d
      if(m){
        X+=oX
        Y+=oY
        Z+=oZ
      }
    }
    Q=()=>[c.width/2+X/Z*800,c.height/2+Y/Z*800]
    I=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
    
    stroke = (scol, fcol) =>{
      if(scol){
        x.closePath()
        x.globalAlpha = .1
        x.lineWidth = Math.min(200, 500/Z)
        x.strokeStyle = scol
        x.stroke()
        x.lineWidth /= 10
        x.globalAlpha = 1
        x.stroke()
      }
      if(fcol){
        x.fillStyle = fcol
        x.fill()
      }
    }

    Cylinder = (rw,cl,ls1,ls2) => {
      let a = []
      for(let i=rw;i--;){
        let b = []
        for(let j=cl;j--;){
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
        }
        //a = [...a, b]
        for(let j=cl;j--;){
          b = []
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          a = [...a, b]
        }
      }
      b = []
      for(let j=cl;j--;){
        X = S(p=Math.PI*2/cl*j) * ls1
        Y = ls2/2
        Z = C(p) * ls1
        b = [...b, [X,Y,Z]]
      }
      //a = [...a, b]
      return a
    }
    
    rw = 3
    cl = 3
    br = 1
    sp = 12/1.5
    iBc = rw * cl * br
    B = Array(iBc).fill().map((v,i) => {
      X = ((i%cl)-cl/2+.5)*sp
      Z = (((i/cl|0)%rw)-rw/2+.5)*sp
      Y = (((i/cl/rw|0)%br)-br/2+.5)*sp
      return [X, Y, Z, Cylinder(32, 16, 2, 22)]
    })
    
    Rn = Math.random
    
    Cube = size =>{
      let ret = []
      for(ret=[], j=6; j--;ret=[...ret,b])for(i=4,b=[];i--;)b=[...b,[(a=[S(p=Math.PI*2/4*i+Math.PI/4),C(p),2**.5/2])[j%3]*(l=j<3?-size:size),a[(j+1)%3]*l,a[(j+2)%3]*l]]
      return ret
    }
    
    boundingSize = 16
    bounding = Cube(boundingSize)
    G = boundingSize*(2**.5)
    iPc = 6, iPv = 1
    P = Array(iPc).fill().map(v=>{
      X =  (Rn()-.5) * G
      Y =  (Rn()-.5) * G
      Z =  (Rn()-.5) * G
      vx = (Rn()-.5) * iPv
      vy = (Rn()-.5) * iPv
      vz = (Rn()-.5) * iPv
      return [X, Y, Z, vx, vy, vz]
    })
    cluds = new Image()
    cluds.src = 'https://raw.githubusercontent.com/srmcgann/render/main/clouds.jpg'
  }

  oX=oY=0, oZ=Math.min(40,Math.max(13,20 + C(t/2)*150))
  Rl=C(t/4)/8, Pt=-S(t/5)*1.5, Yw=S(t/6)*5
  
  x.globalAlpha = .2
  x.drawImage(cluds,0,0,c.width,c.height)
  x.globalAlpha = 1
  x.fillStyle='#0005'
  x.fillRect(0,0,c.width,c.height)
  x.lineJoin = x.lineCap = 'round'
  
  bounding.map(v=>{
    x.beginPath()
    v.map(q=>{
      X = q[0]
      Y = q[1]
      Z = q[2]
      R(Rl,Pt,Yw,1)
      if(Z>0) x.lineTo(...Q())
    })
    stroke('#fff2')
  })
  
  B.map(shp=>{
    tx = shp[0]
    ty = shp[1]
    tz = shp[2]
    shp[3].map((v,i)=>{
      x.beginPath()
      v.map(q=>{
        X1 = q[0]+tx
        Y1 = q[1]+ty
        Z1 = q[2]+tz
        vx = vy = vz = 0
        P.map(n=>{
          X2 = n[0]
          Y2 = n[1]
          Z2 = n[2]
          d = (8.5+Math.hypot(a=X1-X2,b=Y1-Y2,e=Z1-Z2))**6/2e7
          vx += a/8 / d
          vy += b/8 / d
          vz += e/8 / d
        })
        d1 = Math.hypot(vx,vy,vz)
        X = X1 + vx
        Y = Y1 + vy
        Z = Z1 + vz
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
      })
      //stroke('#00ff8806',`hsla(${d1**2*30+200},99%,${Math.max(10,d1**3*4)}%,${Math.min(1,Math.max(.2,d1**3/50))}`)
      alpha1 = Math.min(.5,Math.max(0,d1**3/80))
      alpha2 = Math.min(.3,Math.max(.1,d1**3/80))
      stroke(alpha1>.2?`hsla(${d1**2*20+20+t*1000+360/shp[3].length*i},99%,${Math.max(10,d1**3*3)}%,${alpha1}`:'',
             `hsla(${d1**2*20+20+t*1000+i+360/shp[3].length*i},99%,${Math.max(10,d1**3*1.5)}%,${alpha2}`)
    })
  })
  
  P.map(v=>{
    X = v[0] += v[3]
    Y = v[1] += v[4]
    Z = v[2] += v[5]
    if(X < -G/2 || X > G/2) v[3] *= -1
    if(Y < -G/2 || Y > G/2) v[4] *= -1
    if(Z < -G/2 || Z > G/2) v[5] *= -1
    R(Rl,Pt,Yw,1)
    if(Z>0){
      s = Math.min(1e3, 6e3/Z)
      x.fillStyle = '#4400ff10'
      l = Q()
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=3
      x.fillStyle = '#0fa3'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=5
      x.fillStyle = '#fff'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
    }
  })
  
  t+=1/60
  requestAnimationFrame(Draw)
}
Draw()