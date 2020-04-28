module.exports = (io)=>{
  let players = {};
  io.on('connection',socket=>{
    console.log('New Socket with ID: ',socket.id);
    socket.ip = socket.handshake.headers['x-forwarded-for'];
    if(socket.ip){
      socket.ipStore = socket.ip.split(',')[0].replace(/\./g, "_");
      io.emit('msg',`Welcome to the server!<br>Your IP: ${socket.ip.split(',')[0]}`);
    }else{
      io.emit('msg','Welcome to the server!<br>Your IP: UNKNOWN');
    }
    players[socket.id] = {name:'ANONYMOUS'};
    socket.on('disconnect',()=>{
      console.log(`User with id: ${socket.id} disconnected.`);
      delete players[socket.id];
    })
    socket.on('echo',data=>{
      io.emit('msg', data);
    })
    socket.on('private-echo',data=>{
      socket.emit('msg', data);
    })
    socket.on('set-name', name=>{
      players[socket.id] = name;
      io.emit('update-name', { id:socket.id , name: name} );
    })
    socket.on('send-msg', data=>{
      io.to(data.id).emit('msg', data.msg);
    })
    });
}
