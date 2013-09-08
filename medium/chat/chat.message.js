
exports.add=function(option,fn){
	var content=option.content,uid=option.uid,fromuid=option.fromuid;
	if(!content || !uid || !fromuid) fn(0);
	MU('chat.message',function(m_message){
		var mm_message=new m_message.mongodb();
		mm_message.addMessage({uid:uid,fromuid:fromuid,content:content},fn);
	});
}

exports.unread=function(option,fn){
	var uid=option.uid;
}

exports.history=function(option,fn){

}

exports.img=function(option,fn){
	
}

exports.voice=function(option,fn){

}