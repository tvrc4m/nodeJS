var model=require(CORE+'model.js');

exports.mongodb=ChatMessageVoiceMongo;

exports.redis=ChatMessageVoiceRedis;

/**
	chat_message_voice{_id:mongoid,data:stream}
**/

function ChatMessageVoiceMongo(){
	model.mongodb.call(this);
	this.table="chat_message_voice";
};

ChatMessageVoiceMongo.prototype.__proto__=model.mongodb.prototype;

//添加声音
ChatMessageVoiceMongo.prototype.addVoice=function(data,fn){
	this.gridfs({'write':data},{},'w',fn);
}

//获取声音
ChatMessageVoiceMongo.prototype.getVoice=function(_id,fn){
	this.gridfs({'read':1},{_id:_id},'r',fn);
}

function ChatMessageVoiceRedis(){
	console.log(2222);
};
