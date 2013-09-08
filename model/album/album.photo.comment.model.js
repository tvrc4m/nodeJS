
var model=require(CORE+'model.js');

exports.mongodb=AlbumPhotoCommentMongo;

exports.redis=AlbumPhotoCommentRedis;

/**
	album_photo_comment{_id:photo_id:mongoid,commentnum:int,comments:[uid:mongoid,content:string,ctime:timestamp]}
**/

function AlbumPhotoCommentMongo(){
	model.mongodb.call(this);
	this.table="album_photo_comment";
};

AlbumPhotoCommentMongo.prototype.__proto__=model.mongodb.prototype;

//添加照片评论
AlbumPhotoCommentMongo.prototype.addPhotoComment=function(photo_id,data,fn){
	this.query({'update':{_id:photo_id},'set':{$addToSet:data,$inc:{commentnum:1}},'option':{upsert:1}},fn);
}

//获取照片评论
AlbumPhotoCommentMongo.prototype.getPhotoComments=function(photo_id,option,fn){
	this.find({'findOne':{_id:photo_id},'option':option},fn);
}

//删除照片评论
AlbumPhotoCommentMongo.prototype.delPhotoComment=function(photo_id,uid,timestamp,fn){
	this.query({'update':{_id:photo_id,'comments.uid':uid,'comments.timestamp':timestamp},'set':{$unset:{'comments.$':1},$inc:{commentnum:-1}}},fn);
}

function AlbumPhotoCommentRedis(){
	console.log(2222);
};
