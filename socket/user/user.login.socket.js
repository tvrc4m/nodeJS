

exports=module.exports=function(socket,user){
	
	socket.on('user.login',function(data){
		console.log(data);
		IUSER('user.login',data,fn,socket);
	});
}