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

function register(that){
	var uname=$("#register_form input[name='uname']").val();
	var password=$("#register_form input[name='pwd']").val();
	socket.emit('user.register.uname',{uname:uname,pwd:password});
}