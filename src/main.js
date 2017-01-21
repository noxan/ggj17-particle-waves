import Phaser from 'phaser'

class DefaultState extends Phaser.State {
  init() {
  }

  preload() {
    game.load.image('particle', require('./assets/4x4.png'))
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    this.bases = []
    this.clickRate = 500
    this.nextClick = 0

    const leftEmitter = game.add.emitter(50, game.world.centerY, 250)
    // leftEmitter.bounce.setTo(0.5, 0.5)
    leftEmitter.lifespan = 20
    leftEmitter.particleAnchor = new Phaser.Point(0.5, 0.5)
    leftEmitter.setXSpeed(150, 200)
    leftEmitter.setYSpeed(-2, 2)
    leftEmitter.gravity = 0
    leftEmitter.height = 3
    leftEmitter.makeParticles('particle', 0, 250, true, false)

    //leftEmitter.start(false, 0, 200)
    leftEmitter.flow(10000, 100, 2, -1, true)

    this.leftEmitter = leftEmitter;
  }

  placeObject() {
    if (game.time.now < this.nextClick) {
      return
    }

    this.nextClick = game.time.now + this.clickRate

    const pos = game.input.mousePointer

    const base = game.add.sprite(pos.x, pos.y, 'texture-missing')
    base.anchor.set(0.5)
    console.log(pos.x, pos.y)

    this.bases.push(base)
  }

  update() {
    if (game.input.activePointer.isDown) {
      this.placeObject()
    }

    game.debug.text(`Bases: ${this.bases.length}`, 50, 50)

    this.leftEmitter.forEachAlive(particle => {
      particle.checkWorldBounds = true
      particle.outOfBoundsKill = true

      // angle: game.physics.arcade.angleBetween(particle, base),
      const vector = this.bases.reduce((obj, base) => {
        const distance = game.physics.arcade.distanceBetween(particle, base)
        const dx = base.x - particle.x
        const dy = base.y - particle.y
        const ds = (640 - distance) / 640

        return {
          x: (obj.x + dx) / 2,
          y: (obj.y + dy) / 2,
        }
      }, { x: 0, y: 0 })

      if (particle.x !== 0 && particle.y !== 0) {
        game.debug.geom(new Phaser.Line(
          particle.x,
          particle.y,
          particle.x + vector.x,
          particle.y + vector.y
        ))
      }

      // game.physics.arcade.accelerateToObject(particle, base, distance)

      // const distance = game.physics.arcade.distanceToPointer(particle)
      // game.physics.arcade.moveToPointer(particle, distance)
    })
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
