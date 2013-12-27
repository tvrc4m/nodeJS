

exports=module.exports=function(socket,user){

	//查找附近的人
	socket.on('nearby.find',function(data){
		
	});

	//向附近的人添加好友请求
	socket.on('nearby.add.friend.notice',function(data){

	});

	//同意对方的添加好友请求
	socket.on('nearby.add.friend.agree',function(data){

	});

	//拒绝对方的添加好友请求
	socket.on('nearby.add.friend.refuse',function(data){

	});
}