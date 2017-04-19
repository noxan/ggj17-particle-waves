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
    this.playerConfig = [
      { x: 50, y: game.world.centerY, speedFactor: 1, tint: 0xffffff },
      { x: game.world.width - 50, y: game.world.centerY, speedFactor: -1, tint: 0xff00ff },
    ]

    this.players = []
    this.players.push(this.createPlayer())
    this.players.push(this.createPlayer())
  }

  createPlayer() {
    const playerCount = this.players.length

    const spawnPosition = this.playerConfig[playerCount]

    const leftEmitter = game.add.emitter(spawnPosition.x, spawnPosition.y, this.maxParticles)
    // leftEmitter.bounce.setTo(0.5, 0.5)
    leftEmitter.lifespan = 20
    leftEmitter.particleAnchor = new Phaser.Point(0.5, 0.5)
    leftEmitter.setXSpeed(150 * spawnPosition.speedFactor, 200 * spawnPosition.speedFactor)
    leftEmitter.setYSpeed(-2, 2)
    leftEmitter.gravity = 0
    leftEmitter.height = 3
    leftEmitter.makeParticles('particle', 0, this.maxParticles, true, false)

    //leftEmitter.start(false, 0, 200)
    leftEmitter.flow(10000, 100, 2, -1, true)

    return leftEmitter
  }

  updateParticles(playerIndex, particle) {
    particle.checkWorldBounds = true
    particle.outOfBoundsKill = true

    const currentPlayer = this.playerConfig[playerIndex]

    particle.tint = currentPlayer.tint

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

    particle.body.acceleration = new Phaser.Point(-2 * vector.x, -2 * vector.y)

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

    this.bases.forEach(base =>
      game.debug.geom(new Phaser.Circle(base.x, base.y, this.baseInfluenceRadius * 2), 'rgba(255,255,255,0.1')
    )

    this.players.forEach((player, index) =>
      player.forEachAlive(particle => this.updateParticles(index, particle))
    )

    this.players.forEach((player, index) => {
      for (let index2 = index + 1; index2 < this.players.length; index2++) {
        const player2 = this.players[index2]
        game.physics.arcade.collide(player, player2, this.onParticlesCollide, null, this)
      }
    })
  }

  onParticlesCollide(player, player2) {
    player.kill()
    player2.kill()
  }
}

class Game extends Phaser.Game {
  constructor() {
    super(1024, 480, Phaser.AUTO)

    this.state.add('Default', DefaultState, false)

    this.state.start('Default')
  }
}

const game = new Game();
