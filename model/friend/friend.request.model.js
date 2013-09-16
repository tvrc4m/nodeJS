var model=require(CORE+'model.js');

exports.mongodb=FriendRequestMongo;

exports.redis=FriendRequestRedis;

/**
	friend_request{_id:mongoid,uid:mongoid,fromuid:mongoid,status:enum}
**/

function FriendRequestMongo(){
	model.mongodb.call(this);
	this.table="friend";
};

FriendRequestMongo.prototype.__proto__=model.mongodb.prototype;

FriendRequestMongo.prototype.addUserFriend=function(uid,data,fn){
	var def={_id:uid,ctime:new Date().getTime(),star:0,remark:'',friend_black:0,friend_view:1,chat_top:0,message_notice:1};
	this.query({'insert':MERGE({},def,data)},fn);
}

FriendRequestMongo.prototype.getUserFriends=function(uid,option,fn){
	if(!fn && typeof option=='function') {fn=option;option={};};
	this.get({'find':{_id:uid},'option':option},fn);
};

FriendRequestMongo.prototype.getUserFriend=function(uid,friend_uid,fn){
	this.get({'findOne':{_id:uid,'friends.uid':friend_uid}},fn);
}

FriendRequestMongo.prototype.delUserFriend=function(uid,friend_uid,fn){
	this.query({'update':{_id:uid,'friend_uid':friend_uid},{'set':$unset:{'friends.$':1}}},fn);
}

FriendRequestMongo.prototype.updateUserFriend=function(uid,friend_uid,data,fn){
	this.query({'update':{_id:uid,'friend_uid':friend_uid},'set':{$set:data},'option':{}},fn);
};

FriendRequestMongo.prototype.findFriends=function(where,option,fn){
	this.query({'find':where,'option':option},fn);
}

function FriendRequestRedis(){
	console.log(2222);
};