import Phaser from 'phaser'

class DefaultState extends Phaser.State {
  init() {
  }

  preload() {
    game.load.spritesheet('balls', require('./assets/balls.png'), 17, 17)
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    const leftEmitter = game.add.emitter(50, game.world.centerY, 250)
    // leftEmitter.bounce.setTo(0.5, 0.5)
    leftEmitter.lifespan = 20
    leftEmitter.setXSpeed(200, 200)
    leftEmitter.setYSpeed(0, 0)
    leftEmitter.gravity = 0;
    leftEmitter.makeParticles('balls', 0, 250, true, false)

    //leftEmitter.start(false, 0, 200)
    leftEmitter.flow(10000, 200, 1, -1, true)

    this.leftEmitter = leftEmitter;
  }

  update() {
    this.leftEmitter.forEachAlive(particle => {
      // particle.checkWorldBounds = true
      particle.outOfBoundsKill = true
      const distance = game.physics.arcade.distanceToPointer(particle)
      game.physics.arcade.moveToPointer(particle, distance)
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
