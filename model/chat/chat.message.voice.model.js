var model=require(CORE+'model.js');

exports.mongodb=ChatMessageVoiceMongo;

exports.redis=ChatMessageVoiceRedis;

/**
	chat_message_Voice{_id:mongoid,data:stream}
**/

function ChatMessageVoiceMongo(){
	model.mongodb.call(this);
	this.table="user";
};

ChatMessageVoiceMongo.prototype.__proto__=model.mongodb.prototype;

ChatMessageVoiceMongo.prototype.addVoice=function(data,fn){
	this.query({'insert':data},fn);
}

ChatMessageVoiceMongo.prototype.getVoice=function(_id,fn){
	this.find({'findOne':{_id:_id}},fn);
}

function ChatMessageVoiceRedis(){
	console.log(2222);
};
