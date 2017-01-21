const io = require('socket.io')(8000)

io.on('connection', function(socket) {
  socket.on('init', function(data) {
    console.log('init', data)
  })
  socket.on('update', function(data) {
    socket.broadcast.emit('update', data)
  })
})
