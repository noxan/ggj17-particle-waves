import Phaser from 'phaser'
import io from 'socket.io-client'

class DefaultState extends Phaser.State {
  init() {
    console.log('init')
    this.socket = io('http://127.0.0.1:8000/')
  }

  preload() {
    game.load.image('particle', require('./assets/4x4.png'))
  }

  create() {
    this.socket.on('update', raw => {
      const data = JSON.parse(raw)

      game.world.removeAll()

      data.forEach(player =>
        player.forEach(obj =>
          game.add.sprite(obj.x, obj.y, 'particle')
        )
      )
    })
  }

  update() {
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
