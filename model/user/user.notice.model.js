var model=require(CORE+'model.js');
var func=require(CORE+'function.js');

exports.mongodb=UserNoticeMongo;

exports.redis=UserNoticeRedis;


/**
	签到user_notice{_id:uid:mongoid,notices:[{type:enum,uid:mongoid,uname:string,content:string,status:boolean,ctime:timestamp}]}
**/

function UserNoticeMongo(){
	model.mongodb.call(this);
	this.table="user_notice";
};

UserNoticeMongo.prototype.__proto__=model.mongodb.prototype;

UserNoticeMongo.prototype.addUserNotice=function(uid,data,fn){
	var def={ctime:new Date().getTime(),status:0};
	this.query({'update':{_id:uid},'set':{$addToSet:func.extend({},def,data)}},fn);
}

UserNoticeMongo.prototype.getUserNotices=function(uid,option,fn){
	if(!fn && typeof option=='function') fn=option;
	this.find({'find':{_id:uid},'option':option},fn);
};

UserNoticeMongo.prototype.getNotice=function(uid,ctime,fn){
	this.get({'findOne':{_id:uid,'notices.ctime':ctime},'fields':{'notices.$':1}},fn);
}

UserNoticeMongo.prototype.delUserNotice=function(uid,ctime,fn){
	this.query({'update':{_id:uid,'notices.ctime':ctime},'set':{'$unset':{'notices.$':1}}},fn);
}

//清除用户所有的通知
UserNoticeMongo.prototype.removeUserAllNotice=function(uid,fn){
	this.query({'delete':{_id:uid}},fn);
}

//设置为已读
UserNoticeMongo.prototype.setUserNoticeRead=function(uid,fn){
	this.query({'update':{_id:uid},'set':{'notices.status':1}});
}

function UserNoticeRedis(){
	console.log(2222);
};

function UserNoticeSphinx(){
	model.sphinx.call(this);
	this.index='user_signin_index';
}

UserNoticeSphinx.prototype.__proto__=model.sphinx.prototype;

UserNoticeSphinx.prototype.nearby=function(sign,data,where,sort,page,limit){
	var params={_index:this.index,_anchor:{attrlat:'latitude',attrlong:'longitude',lat:data.lat,long:data.long}};
	this.add(sign,{},params);
}