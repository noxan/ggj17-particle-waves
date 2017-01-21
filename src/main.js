import Phaser from 'phaser'

class DefaultState extends Phaser.State {
  init() {
  }

  preload() {
    game.load.image('particle', require('./assets/4x4.png'))
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    this.maxParticles = 250
    this.baseInfluenceRadius = 150
    this.bases = []
    this.clickRate = 500
    this.nextClick = 0

    this.leftEmitter = this.createPlayer()
  }

  createPlayer() {
    const leftEmitter = game.add.emitter(50, game.world.centerY, this.maxParticles)
    // leftEmitter.bounce.setTo(0.5, 0.5)
    leftEmitter.lifespan = 20
    leftEmitter.particleAnchor = new Phaser.Point(0.5, 0.5)
    leftEmitter.setXSpeed(150, 200)
    leftEmitter.setYSpeed(-2, 2)
    leftEmitter.gravity = 0
    leftEmitter.height = 3
    leftEmitter.makeParticles('particle', 0, this.maxParticles, true, false)

    //leftEmitter.start(false, 0, 200)
    leftEmitter.flow(10000, 100, 2, -1, true)

    return leftEmitter
  }

  updateParticles(particle) {
    particle.checkWorldBounds = true
    particle.outOfBoundsKill = true

    // angle: game.physics.arcade.angleBetween(particle, base),
    const vector = this.bases.reduce((obj, base, index) => {
      const s = game.physics.arcade.distanceBetween(particle, base)

      const ds = this.baseInfluenceRadius - s
      if (ds < 0) {
        return obj
      }

      const dx = base.x - particle.x
      const dy = base.y - particle.y

      const nx = dx / s
      const ny = dy / s

      /*
      if (particle.x !== 0 && particle.y !== 0) {
        game.debug.geom(new Phaser.Line(
          particle.x,
          particle.y,
          particle.x + nx * ds,
          particle.y + ny * ds
        ), `#ff${index === 0 ? '00' : 'ff'}${index === 0 ? 'ff' : '00'}`)
      }
      */

      return {
        x: (obj.x + nx * ds) / 2,
        y: (obj.y + ny * ds) / 2,
      }
    }, { x: 0, y: 0 })

    particle.body.acceleration = new Phaser.Point(vector.x, vector.y)

    /*
    if (particle.x !== 0 && particle.y !== 0) {
      game.debug.geom(new Phaser.Line(
        particle.x,
        particle.y,
        particle.x + vector.x,
        particle.y + vector.y
      ), '#ff0000')
    }
    */

    // game.physics.arcade.accelerateToObject(particle, base, distance)

    // const distance = game.physics.arcade.distanceToPointer(particle)
    // game.physics.arcade.moveToPointer(particle, distance)
  }


  placeObject() {
    if (game.time.now < this.nextClick) {
      return
    }

    this.nextClick = game.time.now + this.clickRate

    const pos = game.input.mousePointer

    const base = game.add.sprite(pos.x, pos.y, 'flare-missing')
    base.anchor.set(0.5)
    console.log(pos.x, pos.y)

    this.bases.push(base)
  }

  update() {
    if (game.input.activePointer.isDown) {
      this.placeObject()
    }

    game.debug.text(`Bases: ${this.bases.length}`, 50, 50)

    /*
    this.bases.forEach(base =>
      game.debug.geom(new Phaser.Circle(base.x, base.y, this.baseInfluenceRadius * 2)
    ))
    */

    this.leftEmitter.forEachAlive(particle => this.updateParticles(particle))
  }
}

class Game extends Phaser.Game {
  constructor() {
    super(640, 480, Phaser.AUTO)

    this.state.add('Default', DefaultState, false)

    this.state.start('Default')
  }
}

const game = new Game();
