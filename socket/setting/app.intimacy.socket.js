

exports=module.exports=function(socket,user){

	//加我为朋友时是否需要验证  default:true
	socket.on('app.intimacy.add.validate',function(data){

	});

	//回复陌生人是否自动添加为朋友  default:false
	socket.on('app.intimacy.reply.friend',function(data){

	});

	//通过昵称是否可以搜索到我
	socket.on('app.intimacy.find.by.uname',function(data){

	});

	socket.on('app.intimacy.recommand.to.me',function(data){

	});

	//朋友圈黑名单用户列表,
	socket.on('app.intimacy.friend.zone.black.list',function(data){

	});

	//朋友圈黑名单增加用户
	socket.on('app.intimacy.friend.zone.black.add',function(data){

	});

	//朋友圈黑名单删除用户
	socket.on('app.intimacy.friend.zone.black.del',function(data){

	});

	//情侣空间的公开权限设置  default:false
	socket.on('app.intimacy.lovers.zone.public',function(data){

	});


}