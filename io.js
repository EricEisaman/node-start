module.exports = (io)=>{
  var players = {};
  io.on('connection',socket=>{
    console.log('New Socket with ID: ',socket.id);
    socket.ip = socket.handshake.headers['x-forwarded-for'];
    if(socket.ip){
      socket.ipStore = socket.ip.split(',')[0].replace(/\./g, "_");
      io.emit('msg',`Welcome to the server!<br>Your IP: ${socket.ip.split(',')[0]}`);
    }else{
      io.emit('msg','Welcome to the server!<br>Your IP: UNKNOWN');
    }
    players[socket.id] = {};
    socket.on('disconnect',()=>{
      console.log(`User with id: ${socket.id} disconnected.`);
      delete players[socket.id];
    })
  });
}
