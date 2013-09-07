

exports=module.exports=function(socket,user){

	//聊天发送语音，语音另外保存一张表，在message的content字段中关联_id
	socket.on('chat.message.voice.save',function(data){

	});

}