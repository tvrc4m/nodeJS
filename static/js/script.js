//Socket.io
var socket = io.connect();

socket.on('error', function (reason){
  console.error('Unable to connect Socket.IO', reason);
});
  
socket.on('connect', function (){
  socket.emit('user.login',{uid:34234});
});