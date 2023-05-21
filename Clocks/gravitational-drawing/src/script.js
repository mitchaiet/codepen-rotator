const { cos, sin, pow, atan2, min, max, PI: π } = Math
const query = document.querySelector.bind(document)
const canvas = query('canvas')
const ctx = canvas.getContext('2d')

const Physics = {
  G: 6.7 * 10,
}

const setup = () => {
  const width = 600
  const height = 600
  canvas.width = width
  canvas.height = height
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
  return {
    width,
    height
  }
}

const { width, height } = setup()

const Marker = {
  // Not confident about physics terminology
  init({ x, y, mass, radius, style, velocity, angle }) {
    this.x = x
    this.y = y
    this.mass = mass
    this.radius = radius
    this.style = style
    this.velocity = velocity
    this.angle = angle
    this.momentX = this.velocity * cos(this.angle)
    this.momentY = this.velocity * sin(this.angle)
    this.velocityX = this.momentX
    this.velocityY = this.momentY
    this.trail = [{
      x: this.x,
      y: this.y
    }]
  },

  gravitateTo(attractor) {
    const force =
      Physics.G *
      this.mass *
      attractor.mass /
      (pow(attractor.x - this.x, 2) + pow(attractor.y - this.y, 2))
    const angle = atan2(attractor.y - this.y, attractor.x - this.x)
    this.momentX += force * cos(angle)
    this.momentY += force * sin(angle)
  },

  tick() {
    this.momentX *= 0.8
    this.momentY *= 0.8
    this.velocityX += this.momentX / 100
    this.velocityY += this.momentY / 100
    this.x += this.velocityX / 100
    this.y += this.velocityY / 100
    this.trail.push({
      x: this.x,
      y: this.y
    })
    this.momentX = 0
    this.momentY = 0
  },

  draw(ctx) {
    this.tick()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, π * 2)
    ctx.fillStyle = this.style
    ctx.fill()
    ctx.beginPath()
    for (let i = 0; i < this.trail.length; i++) {
      ctx.lineTo(this.trail[i].x, this.trail[i].y)
    }
    ctx.lineWidth = this.radius
    ctx.strokeStyle = this.style
    ctx.stroke()
  }
}

const Masses = {
  topLeft: {
    x: width / 6,
    y: height / 6,
    radius: 10,
    mass: 1000,
    style: 'slateblue'
  },
  topCenter: {
    x: width / 2,
    y: height / 6,
    radius: 10,
    mass: 1000,
    style: 'slateblue'
  },
  topRight: {
    x: width - width / 6,
    y: height / 6,
    radius: 10,
    mass: 1000,
    style: 'slateblue'
  },
  centerLeft: {
    x: width / 6,
    y: height / 2,
    radius: 10,
    mass: 1000,
    style: 'slateblue'
  },
  centerRight: {
    x: width - width / 6,
    y: height / 2,
    radius: 10,
    mass: 1000,
    style: 'slateblue'
  },
  bottomLeft: {
    x: width / 6,
    y: height - height / 6,
    radius: 10,
    mass: 1000,
    style: 'slateblue'
  },
  bottomCenter: {
    x: width / 2,
    y: height - height / 6,
    radius: 10,
    mass: 1000,
    style: 'slateblue'
  },
  bottomRight: {
    x: width - width / 6,
    y: height - height / 6,
    radius: 10,
    mass: 1000,
    style: 'slateblue'
  }
}

const drawMass = (mass, ctx) => {
  ctx.beginPath()
  ctx.arc(mass.x, mass.y, mass.radius, 0, 2 * π)
  ctx.fillStyle = mass.style
  ctx.fill()
}

const markerSettings = {
  x: width / 2,
  y: height / 2,
  mass: 200,
  radius: 3,
  style: 'black',
  velocity: 1,
  angle: 0
}

const createGravitySequence = () => {
  let frame = 0
  return () => {
    if (frame < 300) {
      const currentMass = Masses.topLeft.mass
      const targetMass = 1500
      const massIncrement = targetMass / currentMass
      Masses.topLeft.mass = min(targetMass, currentMass + massIncrement)
      const currentRadius = Masses.topLeft.radius
      const targetRadius = 30
      const radiusIncrement = (targetRadius / currentRadius) / 100
      Masses.topLeft.radius = min(targetRadius, currentRadius + radiusIncrement)
    }
    if (frame === 300) {
      Masses.topLeft.radius = 0
      Masses.topLeft.mass = 0
    }
    if (frame === 365) {
      Masses.topCenter.radius = 0
      Masses.topCenter.mass = 0
    }
    if (frame === 370) {
      Masses.centerRight.radius = 30
      Masses.centerRight.mass = 1800
    }
    if (frame === 410) {
      Masses.centerRight.radius = 50
      Masses.centerRight.mass = 3000
    }
    if (frame === 435) {
      Masses.bottomRight.radius = 25
      Masses.bottomRight.mass = 1200
    }
    if (frame > 500 && frame < 600) {
      const currentMass = Masses.centerRight.mass
      const targetMass = 0
      const massDecrement = (currentMass - targetMass) / 20
      Masses.centerRight.mass = currentMass - massDecrement
      const currentRadius = Masses.centerRight.radius
      const targetRadius = 0
      const radiusDecrement = (currentRadius - targetRadius) / 20
      Masses.centerRight.radius = currentRadius - radiusDecrement
    }
    if (frame === 595) {
      Masses.bottomLeft.radius = 0
      Masses.bottomLeft.mass = 0
    }
    if (frame === 690) {
      Masses.centerLeft.radius = 0
      Masses.centerLeft.mass = 0
    }
    if (frame > 680 && frame < 700) {
      Masses.topLeft.mass += (3000 - Masses.topLeft.mass) / 10
      Masses.topLeft.radius += (35 - Masses.topLeft.radius) / 10
    }
    if (frame > 730) {
      Masses.bottomRight.mass *= 0.9
      Masses.bottomRight.radius *= 0.9
    }
    if (frame > 740 && frame < 760) {
      Masses.centerRight.mass = max(Masses.centerRight.mass, 1)
      Masses.centerRight.radius = max(Masses.centerRight.radius, 1)
      Masses.centerRight.mass *= 1.22
      Masses.centerRight.radius *= 1.2
    }
    if (frame > 830) {
      Masses.centerRight.mass *= 0.99
      Masses.centerRight.radius *= 0.99
    }
    if (frame > 850) {
      Masses.topLeft.mass *= 0.9
      Masses.topLeft.radius *= 0.9
    }
    if (frame > 900) {
      Object.values(Masses).forEach(mass => {
        mass.mass *= 0.99
        mass.radius *= 0.99
      })
    }
    return frame++
  }
}

const runGravitySequence = createGravitySequence()

const printFrame = (frame) => {
  query('#frame-count').textContent = frame
}

const loop = () => {
  ctx.clearRect(0, 0, width, height)
  const frame = runGravitySequence()
  printFrame(frame)
  Object.values(Masses).forEach(mass => {
    drawMass(mass, ctx)
    Marker.gravitateTo(mass)
  })
  Marker.draw(ctx)
  if (frame > 1400) {
    clearInterval(interval)
  }
}

Marker.init(markerSettings)

const interval = setInterval(loop, 1000 / 60)