var model=require(CORE+'model.js');

exports.mongodb=FriendMongo;

exports.redis=FriendRedis;

/**
	friend{_id:mongoid,friends:[uid:mongoid,remark:string,star:boolean:0,friend_black:boolean:0,frind_view:boolean:1,chat_top:boolean:0,message_notice:boolean:1,chat_background:mongoid]}
	star：标识为星标 frind_black：是否加入黑名单 friend_view 是否在朋友圈中显示好友的图片,chat_top聊天置顶 message_notice:新消息提醒开关 chat_background 聊天背景图
**/

function FriendMongo(){
	model.mongodb.call(this);
	this.table="friend";
};

FriendMongo.prototype.__proto__=model.mongodb.prototype;

FriendMongo.prototype.addUserFriend=function(uid,data,fn){
	var def={_id:uid,ctime:new Date().getTime(),star:0,remark:'',friend_black:0,friend_view:1,chat_top:0,message_notice:1};
	this.query({'insert':MERGE({},def,data)},fn);
}

FriendMongo.prototype.getUserFriends=function(uid,option,fn){
	if(!fn && typeof option=='function') {fn=option;option={};};
	this.get({'find':{_id:uid},'option':option},fn);
};

FriendMongo.prototype.getUserFriend=function(uid,friend_uid,fn){
	this.get({'findOne':{_id:uid,'friends.uid':friend_uid}},fn);
}

FriendMongo.prototype.delUserFriend=function(uid,friend_uid,fn){
	this.query({'update':{_id:uid,'friend_uid':friend_uid},{'set':$unset:{'friends.$':1}}},fn);
}

FriendMongo.prototype.updateUserFriend=function(uid,friend_uid,data,fn){
	this.query({'update':{_id:uid,'friend_uid':friend_uid},'set':{$set:data},'option':{}},fn);
};

FriendMongo.prototype.findFriends=function(where,option,fn){
	this.query({'find':where,'option':option},fn);
}


function FriendRedis(){
	console.log(2222);
};