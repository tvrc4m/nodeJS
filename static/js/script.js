//Socket.io
var socket = io.connect();

socket.on('error', function (reason){
  console.error('Unable to connect Socket.IO', reason);
});
  
socket.on('connect', function (){
  //socket.emit('user.login',{uid:34234});
});

function LoginBtn(that){
	var form=$(that).parents('form');
	var uname=form.find('input[name="uname"]').val();
	var pwd=form.find('input[name="password"]').val();
	socket.emit('user.login',{uname:uname,password:pwd});
}