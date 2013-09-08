var model=require(CORE+'model.js');
var func=require(CORE+'function.js');

exports.mongodb=UserMongo;

exports.redis=UserRedis;

exports.mysql=UserMysql;

exports.sphinx=UserSphinx;

/**
	user{_id:mongoid,uname:string,realname:string,photo:string,sex:enum,workplace:string,professional:string,sign:string,provice:string,city:string,location:string}
**/

function UserMongo(){
	model.mongodb.call(this);
	this.table="user";
};

UserMongo.prototype.__proto__=model.mongodb.prototype;

UserMongo.prototype.addUser=function(data,fn){
	var timestamp=new Date().getTime(),def={ltime:timestamp,score:USER_DEFAULT_SCORE};
	this.query({insert:func.extend({},def,data)},fn);
}

UserMongo.prototype.getUserByUid=function(uid,fields,fn){
	if(!fn && typeof fields=='function') fn=fields;
	this.get({'findOne':{uid:uid},'fields':fields},fn);
};

UserMongo.prototype.getUserByUname=function(uname,fn){
	this.get({findOne:{uname:uname}},fn);
}

UserMongo.prototype.getUserByPhone=function(phone,fn){
	this.get({findOne:{phone:phone}},fn);
}

UserMongo.prototype.updateUserByUid=function(uid,data,fn){
	this.query({'update':{uid:uid},'set':data,'options':{}},fn);
};

UserMongo.prototype.findUsers=function(where,options,fn){
	this.query({find:where,options:options},fn);
}


function UserRedis(){
	console.log(2222);
};

function UserMysql(){
	this.table='ft_cat';
	model.mysql.call(this);
}

UserMysql.prototype.__proto__=model.mysql.prototype;

UserMysql.prototype.getUser=function(uid,fn){
	var params={where:'cid='+uid};
	this.find(params,fn);
}

UserMysql.prototype.on('mysql.get.user.info',function(uid){
	console.log(234235);
})

UserMysql.prototype.on('update.user.info',function(uid){
	console.log(356467);
})

function UserSphinx(){
	model.sphinx.call(this);
	this._index='tbcatindex';
}

UserSphinx.prototype.__proto__=model.sphinx.prototype;

UserSphinx.prototype.getUser=function(sign,fn){
	this.add(sign);
}