var model=require(CORE+'model.js');

exports.mongodb=AlbumPhotoMongo;

exports.redis=AlbumPhotoRedis;

/**
	album_photo{_id:mongoid,ablum_id:_id,data:stream}
**/

function AlbumPhotoMongo(){
	model.mongodb.call(this);
	this.table="album_photo";
};

AlbumPhotoMongo.prototype.__proto__=model.mongodb.prototype;

//往相册中添加照片
AlbumPhotoMongo.prototype.addAlbumPhoto=function(data,fn){
	this.query({'insert':data},fn);
}

//获取单张照片
AlbumPhotoMongo.prototype.getPhoto=function(_id,fn){
	this.find({'findOne':{_id:_id}},fn);
}

//获取相册中的图片,支持分页(option)
AlbumPhotoMongo.prototype.getAlbumPhoto=function(album_id,option,fn){
	this.find({'find':{album_id:ablum_id},'option':option},fn);
}

//删除照片
AlbumPhotoMongo.prototype.delPhoto=function(_id,fn){
	this.query({'delete':{_id:_id}},fn);
}

function AlbumPhotoRedis(){
	console.log(2222);
};
