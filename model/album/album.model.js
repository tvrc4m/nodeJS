var model=require(CORE+'model.js');

exports.mongodb=AlbumMongo;

exports.redis=AlbumRedis;

/**
	album{_id:mongoid,name:string,public:boolean,ctime:timestamp,photonum:int}
**/

function AlbumMongo(){
	model.mongodb.call(this);
	this.table="album";
};

AlbumMongo.prototype.__proto__=model.mongodb.prototype;

AlbumMongo.prototype.createAblum=function(data,fn){
	this.query({'insert':data},fn);
}

AlbumMongo.prototype.getAlbum=function(_id,fn){
	this.find({'findOne':{_id:_id}},fn);
}

AlbumMongo.prototype.updateAlbum=function(_id,data,fn){
	this.query({'update':{_id:_id}},{$set:data},fn);
}

AlbumMongo.prototype.delAlbum=function(_id,fn){
	this.query({'delete':{_id:_id}},fn);
}

function AlbumRedis(){
	console.log(2222);
};
