
var model=require(CORE+'model.js');
var func=require(CORE+'function.js');

exports.mongodb=ChatMessageUnreadMongo;

exports.redis=ChatMessageUnreadRedis;

/**
	chat_message_unread{_id:uid:mongoid,fromuid:mongoid,start:timestamp,end:timestamp,count:int}
**/

function ChatMessageUnreadMongo(){
	model.mongodb.call(this);
	this.table="chat_message_unread";
};

ChatMessageUnreadMongo.prototype.__proto__=model.mongodb.prototype;


//新增或更新用户未读消息记录和个数
ChatMessageUnreadMongo.prototype.updateMessageUnread=function(uid,fromuid,latesttime,fn){
	this.query({'update':{_id:uid,fromuid:fromuid},'set':{$set:{end:latesttime},$inc:{count:1}},'options':{upsert:1}},fn);
};

//获取某对应用户的未读消息记录
ChatMessageUnreadMongo.prototype.getMessageUnread=function(uid,fromuid,fn){
	this.get({'findOne':{_id:uid,fromuid:fromuid}},fn);
};

//清空用户的未读消息记录
ChatMessageUnreadMongo.prototype.removeMessageUnread=function(uid,fromuid,fn){
	this.query({'delete':{_id:uid,fromuid:fromuid}},fn);
}

//获取用户未读消息记录
ChatMessageUnreadMongo.prototype.getUserMessageUnread=function(_id,fn){
	this.find({'find':{_id:_id}},fn);
}

function ChatMessageUnreadRedis(){
	console.log(2222);
};
