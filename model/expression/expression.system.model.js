var model=require(CORE+'model.js');

exports.mongodb=ExpressionSystemMongo;

exports.redis=ExpressionSystemRedis;

/**
	expression_system{_id:mongoid,name:string,public:boolean,ctime:timestamp,photonum:int}
**/

function ExpressionSystemMongo(){
	model.mongodb.call(this);
	this.table="album";
};

ExpressionSystemMongo.prototype.__proto__=model.mongodb.prototype;

ExpressionSystemMongo.prototype.createAblum=function(data,fn){
	this.query({'insert':data},fn);
}

ExpressionSystemMongo.prototype.getAlbum=function(_id,fn){
	this.find({'findOne':{_id:_id}},fn);
}

ExpressionSystemMongo.prototype.updateAlbum=function(_id,data,fn){
	this.query({'update':{_id:_id}},{$set:data},fn);
}

function ExpressionSystemRedis(){
	console.log(2222);
};
