var model=require(CORE+'model.js');

exports.mongodb=ChatMessageImgMongo;

exports.redis=ChatMessageImgRedis;

/**
	chat_message_img{_id:mongoid,data:stream}
**/

function ChatMessageImgMongo(){
	model.mongodb.call(this);
	this.table="user";
};

ChatMessageImgMongo.prototype.__proto__=model.mongodb.prototype;

ChatMessageImgMongo.prototype.addImg=function(data,fn){
	this.query({'insert':data},fn);
}

ChatMessageImgMongo.prototype.getImg=function(_id,fn){
	this.find({'findOne':{_id:_id}},fn);
}

function ChatMessageImgRedis(){
	console.log(2222);
};
