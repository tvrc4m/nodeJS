
var model=require(CORE+'model.js');

exports.mongodb=AlbumPhotoLikeMongo;

exports.redis=AlbumPhotoLikeRedis;

/**
	album_photo_like{_id:photo_id:mongoid,likes:[uid:mongoid],likenum:int}
**/

function AlbumPhotoLikeMongo(){
	model.mongodb.call(this);
	this.table="album_photo_like";
};

AlbumPhotoLikeMongo.prototype.__proto__=model.mongodb.prototype;

//添加照片喜欢
AlbumPhotoLikeMongo.prototype.addPhotoLike=function(_id,uid,fn){
	this.query({'update':{_id:_id},'set':{$addToSet:{likes:uid},$inc:{likenum:1}},'option':{upsert:1}},fn);
}

//获取照片评论
AlbumPhotoLikeMongo.prototype.getPhotoLikes=function(_id,option,fn){
	this.get({'findOne':{_id:_id},'option':option},fn);
}

//删除照片评论
AlbumPhotoLikeMongo.prototype.delPhotoLike=function(photo_id,uid,fn){
	this.query({'update':{_id:photo_id},'set':{$pull:{likes:uid},$inc:{likenum:-1}}},fn);
}

//某用户是否已喜欢过
AlbumPhotoLikeMongo.prototype.hasUserLike=function(photo_id,uid,fn){
	this.get({'findOne':{_id:photo_id,likes:{$in:[uid]}},'fields':{_id:1}},fn);
}

function AlbumPhotoLikeRedis(){
	console.log(2222);
};
