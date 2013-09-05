

exports=module.exports=function(socket,user){
	socket.on('user.get.info',function(data){
		console.log(data);
	});
}