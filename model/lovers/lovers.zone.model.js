var model=require(CORE+'model.js');

exports.mongodb=LoversZoneMongo;

exports.redis=LoversZoneRedis;

/**
	lovers_zone{_id:mongoid,lovers:[mongoid,mongoid],title:string,description:string,public:boolean,ctime:timestamp,status:enum}
	status情侣空间状态: 0->创建中 1->成功创建 -1->已解散
**/

function LoversZoneMongo(){
	model.mongodb.call(this);
	this.table="lovers_zone";
};

LoversZoneMongo.prototype.__proto__=model.mongodb.prototype;

LoversZoneMongo.prototype.createLoversZone=function(data,fn){
	this.query({'insert':data},fn);
}

LoversZoneMongo.prototype.getLoversZone=function(_id,fn){
	this.get({'findOne':{_id:_id}},fn);
}

LoversZoneMongo.prototype.getLoversZoneByUid=function(uid,fn){
	this.get({'findOne':{lovers:{$in:[uid]}}},fn);
}

LoversZoneMongo.prototype.updateLoversZone=function(_id,data,fn){
	this.query({'update':{_id:_id}},{$set:data},fn);
}

LoversZoneMongo.prototype.delLoversZone=function(_id,fn){
	this.query({'delete':{_id:_id}},fn);
}

function LoversZoneRedis(){
	console.log(2222);
};
