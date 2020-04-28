module.exports = (io)=>{
  let players = {};
  io.on('connection',socket=>{
    console.log('New Socket with ID: ',socket.id);
    socket.ip = socket.handshake.headers['x-forwarded-for'];
    if(socket.ip){
      socket.ipStore = socket.ip.split(',')[0].replace(/\./g, "_");
      socket.emit('msg',`Welcome to the server!<br>Your IP: ${socket.ip.split(',')[0]}`);
    }else{
      socket.emit('msg','Welcome to the server!<br>Your IP: UNKNOWN');
    }
    players[socket.id] = {name:'ANONYMOUS'};
    if(Object.keys(players)){
      let p = [];
      Object.keys(players).forEach(id=>{
        p.push({id:id , name:players[id].name});
      });
      socket.emit('current-players',p);
      socket.broadcast.emit('update-name',{id:socket.id , name:players[socket.id].name});
    }
    socket.on('disconnect',()=>{
      console.log(`User with id: ${socket.id} disconnected.`);
      io.emit('remove-player', socket.id );
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
