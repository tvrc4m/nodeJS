

exports=module.exports=function(socket,user){

	//聊天置顶
	socket.on('chat.user.setting.top',function(data){

	});

	//关闭此用户的新消息提醒
	socket.on('chat.user.setting.new.message.notice.close',function(data){

	});
	
	//设置此用户的聊天背景图
	socket.on('chat.user.setting.backgroup',function(data){

	});

	//查找聊天记录
	socket.on('chat.user.message.search',function(data){

	});

	//清空此人的聊天记录
	socket.on('chat.user.message.remove',function(data){

	});
}