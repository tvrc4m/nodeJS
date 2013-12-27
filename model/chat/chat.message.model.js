var model=require(CORE+'model.js');

exports.mongodb=ChatMessageMongo;

exports.redis=ChatMessageRedis;

/**
	chat_message{_id:mongoid,uid:mongoid,touid:mongoid,content:string,ctime:timestamp}
**/

function ChatMessageMongo(){
	model.mongodb.call(this);
	this.table="chat_message";
};

ChatMessageMongo.prototype.__proto__=model.mongodb.prototype;

ChatMessageMongo.prototype.addMessage=function(data,fn){
	var def={ctime:new Date().getTime()};
	this.query({'insert':MERGE({},def,data)},fn);
}

ChatMessageMongo.prototype.listMessage=function(where,option,fn){
	var limit=option.limit || 20;
	this.find({'find':where,'options':{limit:limit}},fn);
};

ChatMessageMongo.prototype.searchMessage=function(uname,fn){
	//TODO:未实现
	var timespan=option.timespan || 0;
	this.find({'findOne':{uname:uname}},fn);
}

function ChatMessageRedis(){
	console.log(2222);
};
